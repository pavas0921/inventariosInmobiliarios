import { IsNotEmpty, IsOptional, IsEnum, IsEmail, Length, IsArray, ArrayNotEmpty, IsBoolean } from "class-validator";
import { CustomerType } from "src/common/enums/customer-types.enum";
import { DocumentType } from "src/common/enums/document-types.enum";

export class CreateCustomerDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @Length(3, 70, { message: 'El nombre debe tener entre 2 y 70 caracteres' })
    firstName: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @Length(3, 70, { message: 'El apellido debe tener entre 2 y 70 caracteres' })
    lastName: string;

    @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
    @IsEnum(DocumentType, { message: 'Tipo de documento inválido' })
    documentType: DocumentType;

    @IsNotEmpty({ message: 'El número de documento es obligatorio' })
    @Length(8, 15, { message: 'El número de documento debe tener entre 8 y 15 caracteres' })
    documentNumber: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    @Length(7, 20, { message: 'El número de teléfono debe tener entre 7 y 20 caracteres' })
    primaryPhone: string;

    @IsOptional()
    @Length(7, 20, { message: 'El número de teléfono debe tener entre 7 y 20 caracteres' })
    secondaryPhone?: string;

    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    address: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsArray({ message: 'Formato inválido para el tipo de cliente' })
    @ArrayNotEmpty({ message: 'Debe tener al menos un tipo de cliente' })
    @IsEnum(CustomerType, { each: true, message: 'Tipo de cliente inválido' })
    ownerType: CustomerType[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}