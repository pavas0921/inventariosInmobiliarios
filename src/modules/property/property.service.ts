import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Property } from './schemas/property.schema';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { TogglePropertyStatusDto } from './dtos/toggle-property-status.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {}

  async create(dto: CreatePropertyDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    try {
      const normalizedComplement = dto.complement?.trim().toUpperCase();

      const property = await this.propertyModel.create({
        ...dto,
        complement: normalizedComplement,
        companyId,
      });

      return {
        success: true,
        data: property,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'La propiedad ya existe con la misma dirección y complemento',
        );
      }

      throw error;
    }
  }

  async findAll(request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    const properties = await this.propertyModel
      .find({ companyId })
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: properties,
    };
  }

  async findById(id: string, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    const property = await this.propertyModel.findOne({
      _id: id,
      companyId,
    });

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    return {
      success: true,
      data: property,
    };
  }

  async update(id: string, dto: UpdatePropertyDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    const property = await this.propertyModel.findOneAndUpdate(
      {
        _id: id,
        companyId,
      },
      {
        ...dto,
        complement: dto.complement?.trim().toUpperCase(),
      },
      { new: true },
    );

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    return {
      success: true,
      data: property,
    };
  }

  async toggleStatus(dto: TogglePropertyStatusDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    const property = await this.propertyModel.findOneAndUpdate(
      {
        _id: dto.propertyId,
        companyId,
      },
      { status: dto.status },
      { new: true },
    );

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    return {
      success: true,
      data: property,
    };
  }
}
