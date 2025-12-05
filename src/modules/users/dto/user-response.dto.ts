import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  readonly _id: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly documentNumber: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly status: boolean;

  @Expose()
  readonly roles: string[];

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  @Exclude()
  readonly password: string;
}

//@Exclude() oculta la propiedad de la respuesta serializada.
//@Expose() asegura que solo se incluyan los campos permitidos.
