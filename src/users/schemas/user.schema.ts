import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;
  
    @Prop({ required: true })
    first_name: string;
  
    @Prop({ required: true })
    last_name: string;
  
    @Prop({ default: 'active' })
    status: string;

    @Prop({ default: false })
    isAdmin: boolean;
  
    @Prop()
    email: string;

    @Prop({ default: Date.now })
    createdAt: Date;
  
    @Prop({ default: Date.now })
    updatedAt: Date;

    _id: Types.ObjectId; // Add this line to include the _id field
}

export const UserSchema = SchemaFactory.createForClass(User);