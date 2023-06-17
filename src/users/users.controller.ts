import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterGuard } from '../auth/gurads/register.guard';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/gurads/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('user')
export class UsersController {
    constructor(
        private readonly usersrService: UsersService,
        ) { }

    @Post('register')
    @UseGuards(RegisterGuard)
    async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersrService.createUser(createUserDto);
    }

    @Post('login')
    async login(@Body() createUserDto: CreateUserDto) {
        return this.usersrService.login(createUserDto);
    }
    @UseGuards(JwtAuthGuard) // Apply JwtAuthGuard to protect the route
    @Get('whoami')
    async whoamI(@Request() req) {
        const userId = req.user.sub; // Retrieve the user ID from the request object
        const user = await this.usersrService.findById(userId); // Use your UsersService method to find the user by ID
        const { username, first_name, last_name, email } = user;
        return { username, first_name, last_name, email };
    }

    @Post('/refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
        const token = await this.usersrService.refreshToken(refreshTokenDto.refreshToken);
        return token;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req) {
        const token = req.headers.authorization.split(' ')[1];
        await this.usersrService.logout(token);
        return { message: 'Logout successful' };
    }
}