import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TokenModule  } from '../token/token.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'), // Read SECRET_KEY from ConfigService
        signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRE') },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokenModule
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, ConfigService],
})
export class UsersModule {}