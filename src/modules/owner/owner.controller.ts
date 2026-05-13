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

import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner-dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { SearchOwnerDto } from './dto/search-owner-dto';

@ApiTags('Owners')
@ApiBearerAuth('bearer')
@Controller('owners')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_OWNER')
  @UsePipes(new ValidationPipe())
  async createOwner(
    @Body() dto: CreateOwnerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ownerService.createOwner(dto, req);

    if (response.success) {
      return res.status(HttpStatus.CREATED).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_OWNER')
  @UsePipes(new ValidationPipe())
  async updateOwner(
    @Param('id') id: string,
    @Body() dto: UpdateOwnerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ownerService.updateOwner(id, dto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('VIEW_OWNERS')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchOwners(
    @Query() query: SearchOwnerDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ownerService.searchOwners(req, query);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }
}
