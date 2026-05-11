import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Company } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiResponse } from 'src/common/api-response.interface';
import { session } from 'passport';
import { Type } from 'typescript';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    session?: ClientSession,
  ) {
    const company = new this.companyModel(createCompanyDto);
    return company.save({ session });
  }

  async findCompanyByNit(nit: string): Promise<Company | null> {
    const company = await this.companyModel.findOne({ nit }).exec();
    return company;
  }

  async activateCompany(
    companyId: Types.ObjectId,
    demoEndDate: Date,
    session?: ClientSession,
  ) {
    const result = await this.companyModel.updateOne(
      { _id: companyId },
      {
        isActive: true,
        demoExpiresAt: demoEndDate,
      },
      { session },
    );
  }
}
