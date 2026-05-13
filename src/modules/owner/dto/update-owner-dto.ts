import { PartialType } from '@nestjs/swagger';
import { CreateOwnerDto } from './create-owner-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { DocumentType } from 'src/common/enums/document-types.enum';

export class UpdateOwnerDto extends PartialType(CreateOwnerDto) {
  @ApiPropertyOptional({
    enum: DocumentType,
    description: 'Tipo de documento',
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;
}