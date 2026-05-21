import { IsOptional, IsNumber, IsEnum, Min, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  InventoryType,
  InventoryStatus,
} from '../schemas/inventory-header.schemas';

export class SearchInventoryHeaderDto {
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
    example: '507f1f77bcf86cd799439011',
    description: 'Filtrar por ID del contrato',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  contractId?: string;

  @ApiProperty({
    enum: InventoryType,
    example: InventoryType.ENTRY,
    description: 'Filtrar por tipo de inventario',
    required: false,
  })
  @IsOptional()
  @IsEnum(InventoryType)
  inventoryType?: InventoryType;

  @ApiProperty({
    enum: InventoryStatus,
    example: InventoryStatus.DRAFT,
    description: 'Filtrar por estado del inventario',
    required: false,
  })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;
}
