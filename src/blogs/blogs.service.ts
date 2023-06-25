import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog, BlogStatus } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create.blog.dto';


@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) { }

  private convertToBlogStatus(status: string): BlogStatus {
    switch (status) {
      case 'delete':
        return BlogStatus.Delete;
      case 'publish':
        return BlogStatus.Publish;
      case 'block':
        return BlogStatus.Block;
      default:
        return BlogStatus.Draft; // Default value if the status is not recognized
    }
  }

  async createBlog(userId: string, createBlogDto: CreateBlogDto) {
    const blog = new this.blogModel({
      ...createBlogDto,
      user: userId,
    });
    return blog.save();
  }

  async adminGetBlogById(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async getAllPublishedBlogs(): Promise<Blog[]> {
    const blogs = await this.blogModel.find({ status: BlogStatus.Publish }).exec();
    return blogs;
  }

  async getAllMyBlogs(userId: string): Promise<Blog[]> {
    const blogs = await this.blogModel
      .find({ user: userId, status: { $in: [BlogStatus.Draft, BlogStatus.Publish, BlogStatus.Block] } })
      .exec();
    return blogs;
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.blogModel.findOne({ _id: id, status: { $in: [BlogStatus.Draft, BlogStatus.Publish, BlogStatus.Block] } }).exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async getPublishedBlogById(blogId: string): Promise<Blog> {
    if (!Types.ObjectId.isValid(blogId)) {
      throw new NotFoundException('Invalid blog ID');
    }

    const blog = await this.blogModel.findOne({ _id: blogId, status: 'publish' }).exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async updateBlog(blogId: string, createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = await this.blogModel.findOne({ _id: blogId }).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Update the blog properties from the createBlogDto
    if (createBlogDto.title) {
      blog.title = createBlogDto.title;
    }

    if (createBlogDto.content) {
      blog.content = createBlogDto.content;
    }

    if (createBlogDto.status) {
      blog.status = this.convertToBlogStatus(createBlogDto.status);
    }

    if (createBlogDto.tags) {
      blog.tags = createBlogDto.tags;
    }

    const updatedBlog = await blog.save();
    return updatedBlog;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const blog = await this.blogModel.findOne({ _id: blogId }).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    blog.status = this.convertToBlogStatus(BlogStatus.Delete);
    await blog.save();

    return true;
  }

  async searchBlogsByTitle(title: string, page: number, limit: number) : Promise<{ blogs: Blog[]; totalCount: number }>{
    const regex = new RegExp(title, 'i');
    const skip = (page - 1) * limit;

    const [blogs, totalCount] = await Promise.all([
      this.blogModel.find({ title: { $regex: regex } }).skip(skip).limit(limit).exec(),
      this.blogModel.countDocuments({ title: { $regex: regex }, status: BlogStatus.Publish }),
    ]);

    return { blogs, totalCount };
  }
  async searchBlogsByTag(tag: string, page: number, limit: number){
    const skip = (page - 1) * limit;
    const totalCount = await this.blogModel.countDocuments({ tags: { $in: [tag] }, status: BlogStatus.Publish });
    const totalPages = Math.ceil(totalCount / limit);

    const blogs = await this.blogModel
      .find({ tags: { $in: [tag] }, status: BlogStatus.Publish })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: blogs,
      page,
      limit,
      totalCount,
      totalPages,
    };
  }
}