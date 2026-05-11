import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { User } from './schemas/user.schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailPasswordDto } from './dto/find-user-by-email-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { ApiResponse } from '../../common/api-response.interface';
import { hashPassword } from './helpers/password-utils';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserPasswordDto } from './dto/change-password.dto';
import { ToggleUserStatusDto } from './dto/toggle-user-status.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    request: any,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const existingUser = await this.findUserByEmailAndCompanyId(
        createUserDto.email,
        companyId,
      );

      if (existingUser) {
        throw new ConflictException(
          'El usuario con el correo electrónico proporcionado ya existe en esta empresa',
        );
      }
      const hashedPassword = await hashPassword(createUserDto.password);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        companyId: companyId,
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
      throw error;
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    request: any,
  ): Promise<any> {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const userObjectId = new Types.ObjectId(userId);

      // 🔎 Validar que el usuario pertenezca a la empresa
      const existingUser = await this.userModel.findOne({
        _id: userObjectId,
        companyId,
      });

      if (!existingUser) {
        throw new NotFoundException('El usuario no existe en esta empresa');
      }

      // 🔎 Validar email único por empresa
      if (updateUserDto.email) {
        const emailExists = await this.userModel.findOne({
          email: updateUserDto.email,
          companyId,
          _id: { $ne: userObjectId },
        });

        if (emailExists) {
          throw new ConflictException(
            'El correo electrónico ya está en uso en esta empresa',
          );
        }
      }

      // 🔎 Validar documento único por empresa
      if (updateUserDto.documentNumber) {
        const docExists = await this.userModel.findOne({
          documentNumber: updateUserDto.documentNumber,
          companyId,
          _id: { $ne: userObjectId },
        });

        if (docExists) {
          throw new ConflictException(
            'El número de documento ya está en uso en esta empresa',
          );
        }
      }

      // 🔧 Transformar roles si vienen
      if (updateUserDto.roles) {
        updateUserDto.roles = updateUserDto.roles.map(
          (role) => new Types.ObjectId(role),
        );
      }

      // 🛠️ Update
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userObjectId,
        { $set: updateUserDto },
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('No se pudo actualizar el usuario');
      }

      // 🔥 Devolvemos directo el documento (sin password)
      const { password, ...userWithoutPassword } = updatedUser.toObject();

      return {
        success: true,
        message: 'Usuario actualizado correctamente',
        data: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al actualizar el usuario');
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

  async findUserByDocumentNumber(documentNumber: string): Promise<User | null> {
    const user = await this.userModel.findOne({ documentNumber }).exec();

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
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
      companyId: user.companyId.toString(),
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

  async createUserRegister(createUserDto: any, session?: ClientSession) {
    const user = new this.userModel(createUserDto);
    return user.save({ session });
  }

  async enableUser(companyId: Types.ObjectId, session?: ClientSession) {
    const enabledUser = await this.userModel.findOneAndUpdate(
      {
        companyId,
      },
      { status: true },
      { new: true, session },
    );

    return enabledUser;
  }

  async findUserByEmailAndCompanyId(email: string, companyId: Types.ObjectId) {
    const user = await this.userModel
      .findOne({ email, companyId, status: true })
      .exec();

    return user;
  }

  async findUserById(
    id: Types.ObjectId,
    companyId: Types.ObjectId,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(id),
      companyId,
    });
    return user;
  }

  async changeUserPassword(dto: ChangeUserPasswordDto, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const userId = new Types.ObjectId(dto.userId);

      const user = await this.findUserById(userId, companyId);

      if (!user) {
        throw new NotFoundException('No se encontró el usuario enviado');
      }

      const hashedPassword = await hashPassword(dto.newPassword);

      user.password = hashedPassword;
      await user.save();

      return {
        success: true,
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error interno al actualizar la contraseña',
      );
    }
  }

  async toggleUserStatus(dto: ToggleUserStatusDto, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const userId = new Types.ObjectId(dto.userId);
      console.log('ToggleUserStatusDto:', dto);

      const user = await this.findUserById(userId, companyId);

      if (!user) {
        throw new NotFoundException('Usuario no encontrado en esta empresa');
      }

      // 🔒 Evitar que se desactive a sí mismo
      if (dto.userId === request.user.userId) {
        throw new BadRequestException('No puedes cambiar tu propio estado');
      }

      user.status = dto.status;
      await user.save();

      return {
        success: true,
        message: `Usuario ${dto.status ? 'habilitado' : 'deshabilitado'} correctamente`,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'Error al actualizar el estado del usuario',
      );
    }
  }
}
