import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
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
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    TokenModule
  ],
  controllers: [BlogsController],
  providers: [BlogsService, ConfigService],
})
export class BlogsModule {}