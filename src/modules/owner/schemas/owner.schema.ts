import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DocumentType } from 'src/common/enums/document-types.enum';

@Schema({ timestamps: true })
export class Owner extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    enum: DocumentType,
  })
  documentType: DocumentType;

  @Prop({ required: true })
  documentNumber: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: true })
  status: boolean;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);

OwnerSchema.index({ companyId: 1, email: 1 }, { unique: true });
OwnerSchema.index({ companyId: 1, documentNumber: 1 }, { unique: true });
