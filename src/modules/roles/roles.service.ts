import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRolDto } from './dto/create-rol.dto';
import { FindRolByName } from './dto/findRolByName.dto';
import { Rol } from './schemas/rol.schema'; // Importa también RolDocument
import { ApiResponse } from 'src/common/api-response.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Rol.name)
    private readonly rolModel: Model<Rol>, // Usa RolDocument para mejor tipado
  ) {}

  async create(createRolDto: CreateRolDto): Promise<ApiResponse<Rol>> {
    try {
      const newRol = new this.rolModel(createRolDto);
      const savedRol = await newRol.save();

      return {
        success: true,
        message: 'Rol creado exitosamente',
        data: savedRol,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Hubo un problema al crear el rol',
      };
    }
  }

  async findAllRoles(): Promise<ApiResponse<Rol[]>> {
    try {
      const roles = await this.rolModel.find().exec();
      const message =
        roles.length === 0 ? 'No roles found' : 'Roles retrieved successfully';
      return {
        success: true,
        message: message,
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve roles',
      };
    }
  }

  async findByName(rolName: string): Promise<Rol> {
    const role = await this.rolModel.findOne({ rolName });

    if (!role) {
      throw new NotFoundException(`Rol ${rolName} no encontrado`);
    }

    return role;
  }
}
