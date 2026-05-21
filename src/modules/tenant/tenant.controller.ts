import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant-dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';
import { UpdateTenantDto } from './dto/update-tenant-dto';
import { SearchTenantDto } from './dto/search-tenant-dto';

@ApiTags('Tenants')
@ApiBearerAuth('bearer')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_TENANT')
  @UsePipes(new ValidationPipe())
  async createTenant(
    @Body() dto: CreateTenantDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.tenantService.createTenant(dto, req);

    if (response.success) {
      return res.status(HttpStatus.CREATED).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_TENANT')
  @UsePipes(new ValidationPipe())
  async updateTenant(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.tenantService.updateTenant(id, dto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('VIEW_TENANTS')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchTenants(
    @Query() query: SearchTenantDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.tenantService.searchTenants(req, query);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }
}
