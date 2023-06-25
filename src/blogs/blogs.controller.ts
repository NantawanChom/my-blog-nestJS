import { Controller, Get, Post, Patch, Delete, Body, Req, UseGuards, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/gurads/jwt-auth.guard';
import { BlogOwnerGuard } from '../auth/gurads/blog-owner.guard';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create.blog.dto';
import { Blog } from './schemas/blog.schema'

@Controller('blog')
export class BlogsController {

    constructor(
        private readonly blogsService: BlogsService,
    ) { }

    @Get()
    async getAllPublicBlogs(): Promise<Blog[]> {
        return this.blogsService.getAllPublishedBlogs();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/my/blogs')
    async getMyBlogs(@Req() request: Request): Promise<Blog[]> {
        const userId = (request as any).user?.sub;
        return this.blogsService.getAllMyBlogs(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async create(@Req() request: Request, @Body() createBlogDto: CreateBlogDto): Promise<Blog> {
        const userId = (request as any).user?.sub;
        return this.blogsService.createBlog(userId, createBlogDto);
    }

    @UseGuards(JwtAuthGuard, BlogOwnerGuard)
    @Get('get/:id')
    async getBlogById(@Param('id') id: string): Promise<Blog> {
        return this.blogsService.getBlogById(id);
    }

    @Get('publish/:id')
    async getBlogPublish(@Param('id') id: string): Promise<Blog> {
        return this.blogsService.getPublishedBlogById(id);
    }

    @UseGuards(JwtAuthGuard, BlogOwnerGuard)
    @Patch(':id/update')
    async update(@Param('id') id: string, @Body() createBlogDto: CreateBlogDto): Promise<Blog> {
        return this.blogsService.updateBlog(id, createBlogDto);
    }

    @UseGuards(JwtAuthGuard, BlogOwnerGuard)
    @Delete(':id/delete')
    async delete(@Param('id') id: string) {
        await this.blogsService.deleteBlog(id);
    }

    @Get('/search')
    async searchBlogsByTitle(@Query('title') title: string, @Query('page') page: number, @Query('limit') limit: number) {
        const { blogs, totalCount } = await this.blogsService.searchBlogsByTitle(title, page, limit);

        return { blogs, totalCount };
    }

    @Get('/search/tag/:tag')
    async searchBlogsByTag(@Param('tag') tag: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,) {
        const result = await this.blogsService.searchBlogsByTag(tag, page, limit);
        return {
            data: result.data,
            page: result.page,
            limit: result.limit,
            totalCount: result.totalCount,
            totalPages: result.totalPages,
        };
    }
}