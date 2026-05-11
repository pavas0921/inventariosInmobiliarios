import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PropertyType {
  APARTAMENTO = 'APARTAMENTO',
  CASA = 'CASA',
  LOCAL = 'LOCAL',
  OFICINA = 'OFICINA',
  BODEGA = 'BODEGA',
}

@Schema({
  timestamps: true,
})
export class Property extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop()
  complement?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({
    required: true,
    enum: PropertyType,
  })
  propertyType: PropertyType;

  @Prop()
  observation?: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  status: boolean;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

// 🔥 Índice compuesto para evitar duplicados
PropertySchema.index(
  { companyId: 1, address: 1, complement: 1 },
  { unique: true },
);
