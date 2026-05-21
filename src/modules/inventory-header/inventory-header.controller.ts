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

import { InventoryHeaderService } from './inventory-header.service';
import { CreateInventoryHeaderDto } from './dto/create-inventory-header-dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';
import { UpdateInventoryHeaderDto } from './dto/update-inventory-header-dto';
import { SearchInventoryHeaderDto } from './dto/search-inventory-header-dto';

@ApiTags('Inventory Headers')
@ApiBearerAuth('bearer')
@Controller('inventory-headers')
export class InventoryHeaderController {
  constructor(
    private readonly inventoryHeaderService: InventoryHeaderService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_INVENTORY_HEADER')
  @UsePipes(new ValidationPipe())
  async createInventoryHeader(
    @Body() dto: CreateInventoryHeaderDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.inventoryHeaderService.createInventoryHeader(
      dto,
      req,
    );

    if (response.success) {
      return res.status(HttpStatus.CREATED).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_INVENTORY_HEADER')
  @UsePipes(new ValidationPipe())
  async updateInventoryHeader(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryHeaderDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.inventoryHeaderService.updateInventoryHeader(
      id,
      dto,
      req,
    );

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('VIEW_INVENTORY_HEADERS')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchInventoryHeaders(
    @Query() query: SearchInventoryHeaderDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.inventoryHeaderService.searchInventoryHeaders(
      req,
      query,
    );

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }
}
