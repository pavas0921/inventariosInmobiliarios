import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './schemas/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';

import { ApiResponse } from '../../common/api-response.interface';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<ApiResponse<Permission>> {
    try {
      const newPermission = new this.permissionModel(createPermissionDto);
      const savedPermission = await newPermission.save();

      return {
        success: true,
        message: 'Permission created successfully',
        data: savedPermission,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create permission',
      };
    }
  }

  async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      const permissions = await this.permissionModel.find().exec();
      const message =
        permissions.length === 0
          ? 'No permissions found'
          : 'Permissions retrieved successfully';
      return {
        success: true,
        message: message,
        data: permissions,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve permissions',
      };
    }
  }
}
