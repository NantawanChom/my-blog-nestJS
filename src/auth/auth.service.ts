import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenService } from '../token/token.service';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) { }

  async validateUser(username: string, password: string): Promise<User | null> {
    // Replace this with your own logic to validate the user (e.g., fetching user from database)
    const user = await this.userModel.findOne({ username }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async generateToken(user: User) {
    const accessToken = this.jwtService.sign({ sub: user._id.toString() });
    const refreshToken = this.jwtService.sign({ sub: user._id.toString() }, { expiresIn: '7d' });

    const accessTokenExpiresIn = ms(this.configService.get<string>('ACCESS_TOKEN_EXPIRE')) / 1000; // 1 day in seconds
    const refreshTokenExpiresIn = ms(this.configService.get<string>('REFRESH_TOKEN_EXPIRE')) / 1000; // 7 days in seconds

    const accessTokenExpireTimestamp = Math.floor(Date.now() / 1000) + accessTokenExpiresIn;
    const refreshTokenExpireTimestamp = Math.floor(Date.now() / 1000) + refreshTokenExpiresIn;

    const token = {
      accessToken,
      refreshToken,
      expiresAt: accessTokenExpireTimestamp, // Set the expiration time accordingly
    };
    await this.tokenService.saveToken(token);

    return {
      accessToken,
      refreshToken,
      expireToken: accessTokenExpireTimestamp,
      expireRefreshToken: refreshTokenExpireTimestamp,
    };
  }

  async refreshToken(refreshToken: string) {
    // Verify and decode the refresh token
    const decodedToken = this.jwtService.verify(refreshToken);

    // Check if the token is valid and not expired
    if (!decodedToken || !decodedToken.sub || !this.tokenService.isRefreshTokenActive(refreshToken)) {
      return null;
    }

    // Get the user ID from the token
    const userId = decodedToken.sub;
    const user = await this.userModel.findById(userId);

    // Generate a new access token
    const token = this.generateToken(user);

    // Return the new access token
    return token
  }

  async logout(accessToken: string): Promise<void> {
    await this.tokenService.invalidateAccessToken(accessToken);
  }
}