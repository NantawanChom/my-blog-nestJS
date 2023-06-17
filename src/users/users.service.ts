import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

  async checkUsernameExists(username: string): Promise<boolean> {
    // Implement logic to check if the username exists in the document
    const user = await this.userModel.findOne({ username }).exec();
    return !!user;
  }

  async login(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.authService.generateToken(user);
    return tokens;
  }

  async logout(accessToken: string){
    await this.authService.logout(accessToken);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {

    const { username, password, first_name, last_name, email } = createUserDto;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user object
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      email,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    return savedUser;
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  async refreshToken(refreshToken: string) {
    const token = await this.authService.refreshToken(refreshToken);
    return token;
  }

}
