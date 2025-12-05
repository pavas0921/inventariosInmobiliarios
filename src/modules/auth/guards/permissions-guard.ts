import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);
    if (!user) throw new ForbiddenException('Usuario no autenticado');

    // 🔸 Obtenemos el usuario actualizado desde la BD con roles y permisos
    const dbUser = await this.usersService.findByIdWithRoles(user.userId);

    if (!dbUser) throw new ForbiddenException('Usuario no encontrado');

    // 🔸 Extraemos los permisos actuales del token (flatten)
    const tokenPermissions = (user.roles ?? [])
      .flatMap((r: any) => r.permissionIds ?? [])
      .map((p: any) => p._id?.toString());

    // 🔸 Extraemos los permisos desde la base de datos (flatten)
    const dbPermissions = (dbUser.roles ?? [])
      .flatMap((r: any) => r.permissionIds ?? [])
      .map((p: any) => p._id?.toString());

    // 🔸 Comparamos si hay discrepancias
    const missingInToken = dbPermissions.filter(
      (permId) => !tokenPermissions.includes(permId),
    );

    console.log(missingInToken);

    if (missingInToken.length > 0) {
      console.warn(
        '⚠️ El token no coincide con los permisos actuales del usuario.',
      );
      console.log('Faltantes:', missingInToken);
      throw new ForbiddenException(
        'Los permisos del token no coinciden con los permisos actuales del usuario.',
      );
    }

    return true;
  }
}
