import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from 'src/common/enums/document-types.enum';

export class CreateOwnerDto {
  @ApiProperty({
    example: 'Andrés',
    description: 'Nombre del propietario',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Pavas',
    description: 'Apellido del propietario',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.CC,
    description: 'Tipo de documento',
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({
    example: '123456789',
    description: 'Número de documento',
  })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({
    example: 'owner@email.com',
    description: 'Correo electrónico',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Cra 43A #10-50',
    description: 'Dirección del propietario',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '+57 3001234567',
    description: 'Teléfono del propietario',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  phone: string;
}
