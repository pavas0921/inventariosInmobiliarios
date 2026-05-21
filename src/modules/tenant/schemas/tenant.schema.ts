import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DocumentType } from 'src/common/enums/document-types.enum';

@Schema({ timestamps: true })
export class Tenant extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    enum: DocumentType,
  })
  documentType: DocumentType;

  @Prop({
    required: true,
    trim: true,
  })
  documentNumber: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  phone: string;

  @Prop({
    trim: true,
  })
  address?: string;

  @Prop({
    trim: true,
  })
  emergencyContactName?: string;

  @Prop({
    trim: true,
  })
  emergencyContactPhone?: string;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

TenantSchema.index({ companyId: 1, email: 1 }, { unique: true });

TenantSchema.index({ companyId: 1, documentNumber: 1 }, { unique: true });
