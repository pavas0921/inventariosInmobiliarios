import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '../schemas/contract.schema';

export class SearchContractDto {
  @ApiProperty({
    example: 0,
    description: 'Número de registros a omitir (paginación)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @ApiProperty({
    example: 10,
    description: 'Número máximo de registros a retornar (paginación)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    example: 'CONT-2024',
    description: 'Búsqueda en contractNumber',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Filtrar por ID de propiedad',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  propertyId?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'Filtrar por ID del propietario',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  ownerId?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439013',
    description: 'Filtrar por ID del inquilino',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  tenantId?: string;

  @ApiProperty({
    enum: ContractStatus,
    example: ContractStatus.ACTIVE,
    description: 'Filtrar por estado del contrato',
    required: false,
  })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
