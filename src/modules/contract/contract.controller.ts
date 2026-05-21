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

import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract-dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';
import { UpdateContractDto } from './dto/update-contract-dto';
import { SearchContractDto } from './dto/search-contract-dto';

@ApiTags('Contracts')
@ApiBearerAuth('bearer')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_CONTRACT')
  @UsePipes(new ValidationPipe())
  async createContract(
    @Body() dto: CreateContractDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.contractService.createContract(dto, req);

    if (response.success) {
      return res.status(HttpStatus.CREATED).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_CONTRACT')
  @UsePipes(new ValidationPipe())
  async updateContract(
    @Param('id') id: string,
    @Body() dto: UpdateContractDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.contractService.updateContract(id, dto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('VIEW_CONTRACTS')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchContracts(
    @Query() query: SearchContractDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.contractService.searchContracts(req, query);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }
}
