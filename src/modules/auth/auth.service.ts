import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './helpers/passwordUtils';
import { ClientSession, Model, Types } from 'mongoose';
import { ActivationToken } from './schemas/activation-token.schema';
import { first } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(ActivationToken.name)
    private readonly activationTokenModel: Model<ActivationToken>,
  ) {}

  async login(credentials: LoginDto) {
    const user = await this.usersService.findUserForAuth(credentials.email);
    console.log(user);

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
      companyId: user.companyId,
      roles: user.roles.map((role: any) => role.rolName),
      permissions: user.roles.flatMap((role: any) =>
        role.permissionIds.map((perm: any) => perm.name),
      ),
    };

    const token = this.jwtService.sign(payload);
    const computedUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      companyId: user.companyId,
    };

    return {
      user: computedUser,
      accessToken: token,
    };
  }

  async registerActivationToken(
    data: {
      token: string;
      userId: Types.ObjectId;
      organizationId: Types.ObjectId;
      expiresAt: Date;
    },
    session?: ClientSession,
  ) {
    return new this.activationTokenModel({
      ...data,
      used: false,
    }).save({ session });
  }

  async getTokenAndCompany(token: string, session?) {
    const data = await this.activationTokenModel
      .findOne({ token })
      .populate('organizationId')
      .session(session);

    return data;
  }

  async updateTokenStatus(token: string, status: boolean, session) {
    return this.activationTokenModel.updateOne(
      { token },
      { used: status },
      { session },
    );
  }
}
