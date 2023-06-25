import { IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
    @IsNotEmpty()
    title: string;

    content: string;

    status: string;

    tags: string[];
}