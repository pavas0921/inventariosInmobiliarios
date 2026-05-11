import { IsString, IsNotEmpty, MinLength, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordDto {
  @ApiProperty({
    example: '665f1c2f9a8b3c0012345678',
    description: 'ID del usuario a actualizar',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'NuevaPassword123*',
    description: 'Nueva contraseña',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
