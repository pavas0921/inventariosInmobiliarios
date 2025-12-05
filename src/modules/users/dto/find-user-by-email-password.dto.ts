import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';

export class FindUserByEmailPasswordDto {
  @IsEmail()
  @IsNotEmpty({
    message: 'El correo electrónica es obligatorio',
  })
  @MaxLength(50, {
    message: 'El correo electrónica debe tener menos de 100 caracteres',
  })
  email: string;
}
