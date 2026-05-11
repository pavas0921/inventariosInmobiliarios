import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Permisos requeridos por el endpoint
    const requiredPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];

    // Si el endpoint no requiere permisos
    if (requiredPermissions.length === 0) {
      return true;
    }

    // Permisos del JWT
    const userPermissions = user.permissions || [];

    // Verificar permisos
    const hasPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermissions) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return true;
  }
}
