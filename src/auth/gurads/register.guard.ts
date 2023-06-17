import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RegisterGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { username } = request.body;
        
        return this.usersService.checkUsernameExists(username).then((exists) => {
            if (exists) {
                // Username exists, deny access
                return false;
            }
            // Username does not exist, allow access
            return true;
        });
    }
}