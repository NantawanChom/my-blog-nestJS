import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum BlogStatus {
  Draft = 'draft',
  Publish = 'publish',
  Delete = 'delete',
  Block = 'block',
}

@Schema()
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ enum: BlogStatus, default: BlogStatus.Draft })
  status: BlogStatus;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  _id: Types.ObjectId; // Add this line to include the _id field
}

export const BlogSchema = SchemaFactory.createForClass(Blog);