import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Owner } from './schemas/owner.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class OwnerRepository {
  constructor(
    @InjectModel(Owner.name)
    private readonly ownerModel: Model<Owner>,
  ) {}

  async create(data: Partial<Owner>) {
    return this.ownerModel.create(data);
  }

  async findByEmail(email: string, companyId: Types.ObjectId) {
    return this.ownerModel.findOne({
      email,
      companyId,
      status: true,
    });
  }

  async findByDocument(documentNumber: string, companyId: Types.ObjectId) {
    return this.ownerModel.findOne({
      documentNumber,
      companyId,
      status: true,
    });
  }

  async findById(id: Types.ObjectId, companyId: Types.ObjectId) {
    return this.ownerModel.findOne({
      _id: id,
      companyId,
      status: true,
    });
  }

  async update(
    id: string,
    companyId: Types.ObjectId,
    updateData: Partial<Owner>,
  ) {
    return this.ownerModel.findOneAndUpdate(
      { documentNumber: id, companyId },
      updateData,
      { new: true },
    );
  }

  async toggleStatus(
    id: Types.ObjectId,
    companyId: Types.ObjectId,
    status: boolean,
  ) {
    return this.ownerModel.findOneAndUpdate(
      { _id: id, companyId },
      { status },
      { new: true },
    );
  }

  async searchOwners(
    companyId: Types.ObjectId,
    skip: number = 0,
    limit: number = 10,
    search?: string,
    documentType?: string,
    status?: boolean,
  ) {
    const query: any = { companyId };

    // Agregar filtro de búsqueda
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { documentNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Agregar filtro de documentType
    if (documentType) {
      query.documentType = documentType;
    }

    // Agregar filtro de status
    if (status !== undefined) {
      query.status = status;
    }

    const total = await this.ownerModel.countDocuments(query);

    const data = await this.ownerModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      data,
      pagination: {
        total,
        skip,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
