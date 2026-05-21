import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InventoryType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

export enum InventoryStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class InventoryHeader extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Contract',
    required: true,
    index: true,
  })
  contractId: Types.ObjectId;

  @Prop({
    required: true,
    enum: InventoryType,
  })
  inventoryType: InventoryType;

  @Prop({
    required: true,
    enum: InventoryStatus,
    default: InventoryStatus.DRAFT,
  })
  status: InventoryStatus;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    trim: true,
  })
  observations?: string;

  @Prop({
    required: true,
  })
  inventoryDate: Date;
}

export const InventoryHeaderSchema =
  SchemaFactory.createForClass(InventoryHeader);

// 🔥 Índice para búsquedas por contrato
InventoryHeaderSchema.index({
  companyId: 1,
  contractId: 1,
});

// 🔥 Índice para listados cronológicos
InventoryHeaderSchema.index({
  companyId: 1,
  inventoryDate: -1,
});
