import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PasswordValidationPipe } from '../../../common/pipes/password-validation-pipe';

export class CreateUserDemoDto {
  @ApiProperty({
    example: 'Andrés',
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  firstName: string;

  @ApiProperty({
    example: 'Pavas',
    description: 'Apellido del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @Length(3, 100, {
    message: 'El apellido debe tener entre 3 y 100 caracteres',
  })
  lastName: string;

  @ApiProperty({
    example: '123456789',
    description: 'Documento de identidad',
  })
  @IsString()
  @IsNotEmpty({ message: 'El documento de identidad es obligatorio' })
  @Length(6, 20, {
    message: 'El documento de identidad debe tener entre 6 y 20 caracteres',
  })
  documentNumber: string;

  @ApiProperty({
    example: 'admin@helloodontologia.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @MaxLength(50, {
    message: 'El correo electrónico debe tener menos de 50 caracteres',
  })
  email: string;

  @ApiProperty({
    example: 'Demo123*',
    description: 'Contraseña segura del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres',
  })
  @Transform(({ value }) => new PasswordValidationPipe().transform(value))
  password: string;
}
