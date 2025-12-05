import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Rol extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    match: /^[A-Z_]+$/,
  })
  rolName: string;

  @Prop({ type: String, required: true, trim: true })
  rolDescription: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Permission' }],
    validate: {
      validator: (permissionIds: Types.ObjectId[]) => permissionIds.length > 0,
      message: 'El rol debe tener al menos un permiso asignado',
    },
  })
  permissionIds: Types.ObjectId[];
}

export const RolSchema = SchemaFactory.createForClass(Rol);
