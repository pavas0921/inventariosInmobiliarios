import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ContractRepository {
  constructor(
    @InjectModel(Contract.name)
    private readonly contractModel: Model<Contract>,
  ) {}

  async create(data: Partial<Contract>) {
    return this.contractModel.create(data);
  }

  async findById(id: string | Types.ObjectId, companyId: Types.ObjectId) {
    return this.contractModel.findOne({
      _id: id,
      companyId,
    });
  }

  async findByContractNumber(
    contractNumber: string,
    companyId: Types.ObjectId,
  ) {
    return this.contractModel.findOne({
      contractNumber,
      companyId,
    });
  }

  async update(
    id: string | Types.ObjectId,
    companyId: Types.ObjectId,
    updateData: Partial<Contract>,
  ) {
    return this.contractModel.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true },
    );
  }

  async searchContracts(
    companyId: Types.ObjectId,
    skip: number = 0,
    limit: number = 10,
    search?: string,
    propertyId?: string,
    ownerId?: string,
    tenantId?: string,
    status?: string,
  ) {
    const query: any = { companyId };

    // Agregar filtro de búsqueda por número de contrato
    if (search) {
      query.contractNumber = { $regex: search, $options: 'i' };
    }

    // Agregar filtros por IDs
    if (propertyId) {
      query.propertyId = new Types.ObjectId(propertyId);
    }

    if (ownerId) {
      query.ownerId = new Types.ObjectId(ownerId);
    }

    if (tenantId) {
      query.tenantId = new Types.ObjectId(tenantId);
    }

    // Agregar filtro de status
    if (status) {
      query.status = status;
    }

    const total = await this.contractModel.countDocuments(query);

    const data = await this.contractModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('propertyId')
      .populate('ownerId')
      .populate('tenantId')
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
