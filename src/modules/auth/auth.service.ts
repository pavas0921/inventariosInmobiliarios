import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';

import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './helpers/passwordUtils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: LoginDto) {
    const user = await this.usersService.findUserForAuth(credentials.email);

    if (!user || !user.status) {
      throw new UnauthorizedException('User or password incorrect');
    }

    const isPasswordValid = await comparePassword(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('User or password incorrect');
    }

    const payload = {
      sub: user._id.toString(),
      roles: (user.roles || []).map((role: any) => ({
        _id: role._id,
        rolName: role.rolName,
        rolDescription: role.rolDescription,
        permissionIds: (role.permissionIds || []).map((perm: any) => ({
          _id: perm._id,
          name: perm.name,
          description: perm.description,
        })),
      })),
    };

    console.log(JSON.stringify(payload, null, 2));

    return this.jwtService.sign(payload);
  }
}
