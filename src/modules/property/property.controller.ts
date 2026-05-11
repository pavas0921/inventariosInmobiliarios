import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { TogglePropertyStatusDto } from './dtos/toggle-property-status.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Properties')
@ApiBearerAuth('bearer')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_PROPERTY')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() dto: CreatePropertyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.propertyService.create(dto, req);

    return res.status(HttpStatus.CREATED).json(response);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('READ_PROPERTY')
  async findAll(@Req() req: Request, @Res() res: Response) {
    const response = await this.propertyService.findAll(req);

    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  @RequirePermissions('READ_PROPERTY')
  @ApiOperation({ summary: 'Obtener propiedad por ID' })
  async findById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.propertyService.findById(id, req);

    return res.status(HttpStatus.OK).json(response);
  }

  // ⚠️ IMPORTANTE: rutas específicas primero
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('status')
  @RequirePermissions('TOGGLE_PROPERTY_STATUS')
  async toggleStatus(
    @Body() dto: TogglePropertyStatusDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.propertyService.toggleStatus(dto, req);

    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_PROPERTY')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.propertyService.update(id, dto, req);

    return res.status(HttpStatus.OK).json(response);
  }
}
