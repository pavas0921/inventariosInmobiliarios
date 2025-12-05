import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiResponse } from 'src/common/api-response.interface';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
      const newCompany = await this.companyModel.create(createCompanyDto);

      if (!newCompany) {
        throw new BadRequestException();
      }

      return newCompany;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al crear la empresa',
      );
    }
  }
}
