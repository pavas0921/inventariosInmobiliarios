import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: string) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if (!passwordRegex.test(value)) {
      throw new BadRequestException(
        'La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y un caracter especial',
      );
    }
    return value;
  }
}
