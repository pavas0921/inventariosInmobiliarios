import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiPropertyOptional({
    example: 'Lámpara de escritorio',
    description: 'Nombre del artículo',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;
}
