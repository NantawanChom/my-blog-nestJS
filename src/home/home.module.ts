import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/myblog'),
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    TokenModule,
    BlogsModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
