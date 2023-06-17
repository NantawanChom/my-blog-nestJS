import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './jwt/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {TokenModule  } from '../token/token.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'), // Read SECRET_KEY from ConfigService
        signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRE') },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokenModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy,],
  exports: [AuthService],
})
export class AuthModule {}