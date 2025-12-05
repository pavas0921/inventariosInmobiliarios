import { IsNotEmpty, IsEmail, MaxLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'andres@example.com',
    description: 'Correo electrónico del usuario',
    maxLength: 50,
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @MaxLength(50, {
    message: 'El correo electrónico debe tener máximo 50 caracteres',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
  })
  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
