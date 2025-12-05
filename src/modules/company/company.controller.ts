import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';

@ApiTags('Company')
@ApiBearerAuth('bearer')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = this.companyService.createCompany(createCompanyDto);
    return {
      message: 'Company created successfully',
      data: company,
    };
  }
}
