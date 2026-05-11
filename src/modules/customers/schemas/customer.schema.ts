import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CustomerType } from 'src/common/enums/customer-types.enum';

@Schema({ timestamps: true })
export class Customer extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    documentType: string;

    @Prop({ required: true })
    documentNumber: string;

    @Prop({ required: true })
    primaryPhone: string;

    @Prop({ required: false })
    secondaryPhone: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    email: string;

    @Prop({ type: [String], enum: CustomerType, required: true })
    ownerType: CustomerType[];

    @Prop({ type: Types.ObjectId, ref: 'Company' })
    companyId: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index(
    { companyId: 1, documentType: 1, documentNumber: 1 },
    { unique: true }
);
