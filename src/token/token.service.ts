import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './schemas/token.model';

@Injectable()
export class TokenService {
  constructor(@InjectModel('Token') private readonly tokenModel: Model<Token>) {}

  async saveToken(token): Promise<Token> {
    const createdToken = new this.tokenModel(token);
    return createdToken.save();
  }

  async invalidateAccessToken(accessToken: string): Promise<void> {
    await this.tokenModel.updateOne({ accessToken }, { active: false });
  }

  async isTokenActive(token: string): Promise<boolean> {
    const activeToken = await this.tokenModel.findOne({
      accessToken: token,
      active: true,
    }).exec();
    return !!activeToken;
  }

  async isRefreshTokenActive(token: string): Promise<boolean> {
    const activeToken = await this.tokenModel.findOne({
      refreshToken: token,
      active: true,
    }).exec();
    return !!activeToken;
  }
}