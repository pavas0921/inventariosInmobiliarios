import { IsMongoId, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TogglePropertyStatusDto {
  @ApiProperty({ example: '665f1c2f9a8b3c0012345678' })
  @IsMongoId()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  status: boolean;
}
