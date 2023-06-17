import { Schema, model, Document } from 'mongoose';

export interface Token extends Document {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  active: boolean; 
}

const tokenSchema = new Schema<Token>({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

export const TokenModel = model<Token>('Token', tokenSchema);