import { PartialType } from '@nestjs/swagger';
import { CreateInventoryHeaderDto } from './create-inventory-header-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { InventoryStatus } from '../schemas/inventory-header.schemas';

export class UpdateInventoryHeaderDto extends PartialType(
  CreateInventoryHeaderDto,
) {
  @ApiPropertyOptional({
    enum: InventoryStatus,
    description:
      'Estado del inventario (DRAFT: borrador, COMPLETED: completado)',
  })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;
}
