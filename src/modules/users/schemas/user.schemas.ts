import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  documentNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Rol',
        required: true,
      },
    ],
    validate: {
      validator: (roles: Types.ObjectId[]) => roles.length > 0,
      message: 'El usuario debe tener al menos un rol asignado',
    },
  })
  roles: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
