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

import { AmbientService } from './ambient.service';
import { CreateAmbientDto } from './dto/create-ambient-dto';
import { UpdateAmbientDto } from './dto/update-ambient-dto';
import { SearchAmbientDto } from './dto/search-ambient-dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';

@ApiTags('Ambients')
@ApiBearerAuth('bearer')
@Controller('ambients')
export class AmbientController {
  constructor(private readonly ambientService: AmbientService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_AMBIENT')
  @UsePipes(new ValidationPipe())
  async createAmbient(
    @Body() dto: CreateAmbientDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ambientService.createAmbient(dto, req);

    if (response.success) {
      return res.status(HttpStatus.CREATED).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('VIEW_AMBIENTS')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchAmbients(
    @Query() query: SearchAmbientDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ambientService.searchAmbients(req, query);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('all')
  @RequirePermissions('VIEW_AMBIENTS')
  async getAllAmbients(@Req() req: Request, @Res() res: Response) {
    const response = await this.ambientService.getAllAmbients(req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  @RequirePermissions('VIEW_AMBIENTS')
  async getAmbientById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ambientService.getAmbientById(id, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_AMBIENT')
  @UsePipes(new ValidationPipe())
  async updateAmbient(
    @Param('id') id: string,
    @Body() dto: UpdateAmbientDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ambientService.updateAmbient(id, dto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  @RequirePermissions('DELETE_AMBIENT')
  async deleteAmbient(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ambientService.deleteAmbient(id, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id/toggle-status')
  @RequirePermissions('UPDATE_AMBIENT')
  async toggleStatusAmbient(
    @Param('id') id: string,
    @Body('status') status: boolean,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.ambientService.toggleStatusAmbient(
      id,
      status,
      req,
    );

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }
}
