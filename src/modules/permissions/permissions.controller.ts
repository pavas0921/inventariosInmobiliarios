import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Response } from 'express';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Res() res: Response,
  ) {
    const result = await this.permissionsService.create(createPermissionDto);

    if (result.success) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Get()
  async findAll() {
    const permissionsResponse =
      await this.permissionsService.getAllPermissions();
    return permissionsResponse;
  }
}
