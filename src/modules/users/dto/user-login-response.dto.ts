import { Expose, Type } from 'class-transformer';

// === PERMISO ===
export class PermissionDto {
  @Expose()
  readonly _id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;
}

// === ROL ===
export class RoleDto {
  @Expose()
  readonly _id: string;

  @Expose()
  readonly rolName: string;

  @Expose()
  readonly rolDescription: string;

  @Expose()
  @Type(() => PermissionDto)
  readonly permissionIds: PermissionDto[];
}

// === USUARIO ===
export class UserLoginResponseDto {
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
  @Type(() => RoleDto)
  readonly roles: RoleDto[];

  @Expose() // 👈 se mantiene visible para la comparación interna de contraseñas
  readonly password: string;
}
