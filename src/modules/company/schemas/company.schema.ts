import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  nit: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  responsibleName: string;

  @Prop({ required: true })
  city: string;

  @Prop({
    type: Date,
  })
  demoExpiresAt?: Date;

  @Prop({ default: false })
  isActive: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
export type CompanyDocument = Company & Document;
