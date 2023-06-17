import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';

@Controller('blog')
export class BlogsController {
    @Get()
    getAllPublicBlogs(): string {
        return 'This action returns all public blogs in website';
    }
    @Get('/my/blogs')
    getMyBlogs(): string {
        return 'This action returns all my blogs';
    }
    @Post('/create')
    create(): string{
        return 'This action create blog';
    }

    @Patch('/:id/update')
    update(): string{
        return 'This action update blog';
    }

    @Delete('/:id/delete')
    delete(): string{
        return 'This action delete blog';
    }
    @Get('/search')
    searchBlogsByTitle(): string{
        return 'This action returns all blogs in search';
    }

    @Get('/search/tag/:tag')
    searchBlogsByTag() : string{
        return 'This action returns all blogs have tag';
    }
}