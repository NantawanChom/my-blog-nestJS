import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BlogsService } from '../../blogs/blogs.service';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class BlogOwnerGuard implements CanActivate {
    constructor(private readonly blogsService: BlogsService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        const { id } = request.params;
        return this.isBlogOwner(id, user.sub);
    }

    private async isBlogOwner(blogId: string, user: User): Promise<boolean> {
        const blog = await this.blogsService.getBlogById(blogId);
        return blog && blog.user === user;
    }
}