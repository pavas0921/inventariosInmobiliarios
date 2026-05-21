import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from 'src/common/enums/document-types.enum';

export class CreateTenantDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del inquilino',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'García',
    description: 'Apellido del inquilino',
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
    example: '987654321',
    description: 'Número de documento',
  })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({
    example: 'tenant@email.com',
    description: 'Correo electrónico',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+573001234567',
    description: 'Número de teléfono',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    example: 'Calle 123 #456',
    description: 'Dirección del inquilino',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'María García',
    description: 'Nombre del contacto de emergencia',
  })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    example: '+573109876543',
    description: 'Teléfono del contacto de emergencia',
  })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;
}
