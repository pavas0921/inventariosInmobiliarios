import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InventoryHeader } from './schemas/inventory-header.schemas';
import { Model, Types } from 'mongoose';

@Injectable()
export class InventoryHeaderRepository {
  constructor(
    @InjectModel(InventoryHeader.name)
    private readonly inventoryHeaderModel: Model<InventoryHeader>,
  ) {}

  async create(data: Partial<InventoryHeader>) {
    return this.inventoryHeaderModel.create(data);
  }

  async findById(id: string | Types.ObjectId, companyId: Types.ObjectId) {
    return this.inventoryHeaderModel.findOne({
      _id: id,
      companyId,
    });
  }

  async update(
    id: string | Types.ObjectId,
    companyId: Types.ObjectId,
    updateData: Partial<InventoryHeader>,
  ) {
    return this.inventoryHeaderModel.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true },
    );
  }

  async searchInventoryHeaders(
    companyId: Types.ObjectId,
    skip: number = 0,
    limit: number = 10,
    contractId?: string,
    inventoryType?: string,
    status?: string,
  ) {
    const query: any = { companyId };

    // Agregar filtro por contrato
    if (contractId) {
      query.contractId = new Types.ObjectId(contractId);
    }

    // Agregar filtro por tipo de inventario
    if (inventoryType) {
      query.inventoryType = inventoryType;
    }

    // Agregar filtro por estado
    if (status) {
      query.status = status;
    }

    const total = await this.inventoryHeaderModel.countDocuments(query);

    const data = await this.inventoryHeaderModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ inventoryDate: -1 })
      .populate('contractId')
      .populate('createdBy')
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

  async searchInventoryHeadersByContractId(
    contractId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    return this.inventoryHeaderModel.find({ contractId, companyId }).exec();
  }
}
