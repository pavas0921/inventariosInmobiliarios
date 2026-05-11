import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'activation_tokens',
})
export class ActivationToken extends Document {
  // Token único
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  token: string;

  // Usuario a activar
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  // Organización / empresa a activar
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  organizationId: Types.ObjectId;

  // Expiración automática TTL
  @Prop({
    required: true,
    index: { expires: 0 },
  })
  expiresAt: Date;

  // Token utilizado
  @Prop({
    default: false,
  })
  used: boolean;
}

export const ActivationTokenSchema =
  SchemaFactory.createForClass(ActivationToken);
