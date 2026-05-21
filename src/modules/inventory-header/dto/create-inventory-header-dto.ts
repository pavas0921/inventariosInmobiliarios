import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  InventoryType,
  InventoryStatus,
} from '../schemas/inventory-header.schemas';

export class CreateInventoryHeaderDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del contrato',
  })
  @IsMongoId()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({
    enum: InventoryType,
    example: InventoryType.ENTRY,
    description: 'Tipo de inventario (ENTRY: entrada, EXIT: salida)',
  })
  @IsEnum(InventoryType)
  @IsNotEmpty()
  inventoryType: InventoryType;

  @ApiProperty({
    example: '2024-05-19',
    description: 'Fecha del inventario (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  inventoryDate: string;

  @ApiPropertyOptional({
    example: 'Inventario de entrada de bienes',
    description: 'Observaciones adicionales',
  })
  @IsOptional()
  @IsString()
  observations?: string;
}
