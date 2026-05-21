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
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item-dto';
import { UpdateItemDto } from './dto/update-item-dto';
import { SearchItemDto } from './dto/search-item-dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';

@ApiTags('Items')
@ApiBearerAuth('bearer')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_ITEM')
  @UsePipes(new ValidationPipe())
  async createItem(
    @Body() dto: CreateItemDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.itemService.createItem(dto, req);

    if (response.success) {
      return res.status(HttpStatus.CREATED).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('VIEW_ITEMS')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchItems(
    @Query() query: SearchItemDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.itemService.searchItems(req, query);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('all')
  @RequirePermissions('VIEW_ITEMS')
  async getAllItems(@Req() req: Request, @Res() res: Response) {
    const response = await this.itemService.getAllItems(req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  @RequirePermissions('VIEW_ITEMS')
  async getItemById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.itemService.getItemById(id, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_ITEM')
  @UsePipes(new ValidationPipe())
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.itemService.updateItem(id, dto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  @RequirePermissions('DELETE_ITEM')
  async deleteItem(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.itemService.deleteItem(id, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id/toggle-status')
  @RequirePermissions('UPDATE_ITEM')
  async toggleStatusItem(
    @Param('id') id: string,
    @Body('status') status: boolean,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.itemService.toggleStatusItem(id, status, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }
}
