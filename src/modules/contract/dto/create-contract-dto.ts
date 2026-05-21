import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de la propiedad',
  })
  @IsMongoId()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID del propietario',
  })
  @IsMongoId()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439013',
    description: 'ID del inquilino',
  })
  @IsMongoId()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    example: 'CONT-2024-001',
    description: 'Número del contrato',
  })
  @IsString()
  @IsNotEmpty()
  contractNumber: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Fecha de inicio del contrato (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2025-01-15',
    description: 'Fecha de término del contrato (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    example: 'Contrato de arrendamiento de vivienda',
    description: 'Observaciones adicionales',
  })
  @IsOptional()
  @IsString()
  observations?: string;
}
