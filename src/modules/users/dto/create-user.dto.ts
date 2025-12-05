import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  MaxLength,
  IsArray,
  IsMongoId,
  ArrayMinSize,
} from 'class-validator';
import { PasswordValidationPipe } from '../../../common/pipes/password-validation-pipe';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  firstName: string;

  @IsString()
  @IsNotEmpty({
    message: 'El apellido es obligatorio',
  })
  @Length(3, 100, {
    message: 'El apellido debe tener entre 3 y 100 caracteres',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty({
    message: 'El documento de identidad es obligatorio',
  })
  @Length(6, 20, {
    message: 'El docuemento de identidadno debe tener entre 6 y 20 caracteres',
  })
  documentNumber: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'El correo electrónico es obligatorio',
  })
  @MaxLength(50, {
    message: 'El correo electrónico debe tener menos de 50 caracteres',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'La contraseña es obligatoria',
  })
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 6 y 20 caracteres',
  })
  @Transform(({ value }) => new PasswordValidationPipe().transform(value))
  password: string;

  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1, {
    message: 'El usuario debe tener al menos un rol asignado',
  })
  roles: Types.ObjectId[];
}
