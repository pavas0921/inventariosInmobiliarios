import { IsMongoId, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleUserStatusDto {
  @ApiProperty({
    example: '665f1c2f9a8b3c0012345678',
    description: 'ID del usuario',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Estado del usuario (true = activo, false = inactivo)',
  })
  @IsBoolean()
  status: boolean;
}
