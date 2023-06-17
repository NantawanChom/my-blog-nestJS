import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from './token.service';
import { TokenModel } from './schemas/token.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenModel.schema }]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}