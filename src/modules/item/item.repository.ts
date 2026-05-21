import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schemas';
import { Model, Types } from 'mongoose';

@Injectable()
export class ItemRepository {
  constructor(
    @InjectModel(Item.name)
    private readonly itemModel: Model<Item>,
  ) {}

  async create(data: Partial<Item>) {
    return this.itemModel.create(data);
  }

  async findByName(name: string, companyId: Types.ObjectId) {
    return this.itemModel.findOne({
      name,
      companyId,
      status: true,
    });
  }

  async findById(id: Types.ObjectId, companyId: Types.ObjectId) {
    return this.itemModel.findOne({
      _id: id,
      companyId,
      status: true,
    });
  }

  async update(
    id: string,
    companyId: Types.ObjectId,
    updateData: Partial<Item>,
  ) {
    return this.itemModel.findOneAndUpdate({ _id: id, companyId }, updateData, {
      new: true,
    });
  }

  async toggleStatus(
    id: Types.ObjectId,
    companyId: Types.ObjectId,
    status: boolean,
  ) {
    return this.itemModel.findOneAndUpdate(
      { _id: id, companyId },
      { status },
      { new: true },
    );
  }

  async searchItems(
    companyId: Types.ObjectId,
    skip: number = 0,
    limit: number = 10,
    search?: string,
    status?: boolean,
  ) {
    const query: any = { companyId };

    // Agregar filtro de búsqueda
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Agregar filtro de status
    if (status !== undefined) {
      query.status = status;
    }

    const total = await this.itemModel.countDocuments(query);

    const data = await this.itemModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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

  async findAll(companyId: Types.ObjectId) {
    return this.itemModel.find({ companyId, status: true }).sort({ name: 1 });
  }

  async deleteById(id: string, companyId: Types.ObjectId) {
    return this.itemModel.findOneAndUpdate(
      { _id: id, companyId },
      { status: false },
      { new: true },
    );
  }
}
