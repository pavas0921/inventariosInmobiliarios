import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailPasswordDto } from './dto/find-user-by-email-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { ApiResponse } from '../../common/api-response.interface';
import { hashPassword } from './helpers/password-utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      const hashedPassword = await hashPassword(createUserDto.password);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        status: true,
      });

      const savedUser = await newUser.save();
      const safeUser = plainToInstance(UserResponseDto, savedUser.toObject(), {
        excludeExtraneousValues: true,
      });
      return {
        success: true,
        message: 'User created successfully',
        data: safeUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create user',
      };
    }
  }

  async findUserByEmail(
    FindUserByEmailPasswordDto: FindUserByEmailPasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.userModel
      .findOne({ email: FindUserByEmailPasswordDto.email, status: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const safeUser = plainToInstance(UserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });

    return safeUser;
  }

  async findUserForAuth(email: string): Promise<UserLoginResponseDto | null> {
    const user = await this.userModel
      .findOne({ email, status: true })
      .populate({
        path: 'roles',
        populate: {
          path: 'permissionIds',
          model: 'Permission',
        },
      })
      .lean()
      .exec();

    if (!user) return null;

    const safeUser: UserLoginResponseDto = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      documentNumber: user.documentNumber,
      email: user.email,
      status: user.status,
      password: user.password,
      roles: (user.roles || []).map((role: any) => ({
        _id: role._id.toString(),
        rolName: role.rolName,
        rolDescription: role.rolDescription,
        permissionIds: (role.permissionIds || []).map((perm: any) => ({
          _id: perm._id.toString(),
          name: perm.name,
          description: perm.description,
        })),
      })),
    };

    return safeUser;
  }

  async findByIdWithRoles(userId: string) {
    return await this.userModel
      .findById(userId)
      .populate({
        path: 'roles',
        populate: {
          path: 'permissionIds',
          model: 'Permission',
        },
      })
      .exec();
  }
}
