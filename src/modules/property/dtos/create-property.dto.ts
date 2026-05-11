import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '../schemas/property.schema';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Cra 43A #10-50' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: 'Apto 301 - Torre 3' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'Medellín' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Antioquia' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiPropertyOptional({ example: 'Propiedad recién remodelada' })
  @IsOptional()
  @IsString()
  observation?: string;
}
