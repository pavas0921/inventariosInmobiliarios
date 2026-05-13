import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from 'src/common/enums/document-types.enum';

export class SearchOwnerDto {
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
    example: 'Andrés',
    description: 'Búsqueda en firstName, lastName, email o documentNumber',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.CC,
    description: 'Filtrar por tipo de documento',
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiProperty({
    example: true,
    description: 'Filtrar por estado (activo/inactivo)',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  status?: boolean;
}
