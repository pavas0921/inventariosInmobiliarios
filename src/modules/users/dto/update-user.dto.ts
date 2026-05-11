import {
  IsString,
  IsOptional,
  Length,
  IsEmail,
  MaxLength,
  IsArray,
  IsMongoId,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Andrés' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Pavas' })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  lastName?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  @Length(6, 20)
  documentNumber?: string;

  @ApiPropertyOptional({ example: 'admin@helloodontologia.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @ApiPropertyOptional({
    example: ['665f1c2f9a8b3c0012345678'],
    description: 'Roles del usuario',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  roles?: Types.ObjectId[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
