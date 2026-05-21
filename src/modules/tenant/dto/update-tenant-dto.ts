import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { DocumentType } from 'src/common/enums/document-types.enum';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @ApiPropertyOptional({
    enum: DocumentType,
    description: 'Tipo de documento',
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;
}
