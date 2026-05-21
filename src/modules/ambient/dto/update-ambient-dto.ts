import { PartialType } from '@nestjs/swagger';
import { CreateAmbientDto } from './create-ambient-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateAmbientDto extends PartialType(CreateAmbientDto) {
  @ApiPropertyOptional({
    example: 'Sala de estar',
    description: 'Nombre del ambiente',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;
}
