import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/create-item-dto';
import { Types } from 'mongoose';
import { UpdateItemDto } from './dto/update-item-dto';
import { SearchItemDto } from './dto/search-item-dto';
import { capitalize } from '../../common/helpers/string/string-utils';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async createItem(dto: CreateItemDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    // Capitalizar el nombre
    const capitalizedName = capitalize(dto.name.trim());

    const existingByName = await this.itemRepository.findByName(
      capitalizedName,
      companyId,
    );

    if (existingByName) {
      throw new ConflictException(
        'Ya existe un artículo registrado con el nombre ' + capitalizedName,
      );
    }

    const item = await this.itemRepository.create({
      ...dto,
      name: capitalizedName,
      companyId,
    });

    return {
      success: true,
      data: item,
    };
  }

  async updateItem(id: string, dto: UpdateItemDto, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const itemId = new Types.ObjectId(id);

      const existingItem = await this.itemRepository.findById(
        itemId,
        companyId,
      );

      if (!existingItem) {
        throw new NotFoundException('Artículo no encontrado');
      }

      const updateData: any = {};

      if (dto.name) {
        const capitalizedName = capitalize(dto.name.trim());

        if (capitalizedName !== existingItem.name) {
          const nameExists = await this.itemRepository.findByName(
            capitalizedName,
            companyId,
          );

          if (nameExists) {
            throw new ConflictException(
              'Ya existe un artículo con este nombre',
            );
          }
        }

        updateData.name = capitalizedName;
      }

      const updatedItem = await this.itemRepository.update(
        id,
        companyId,
        updateData,
      );

      return {
        success: true,
        message: 'Artículo actualizado correctamente',
        data: updatedItem,
      };
    } catch (error) {
      throw error;
    }
  }

  async searchItems(request: any, query: SearchItemDto) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const { skip = 0, limit = 10, search, status } = query;

      const result = await this.itemRepository.searchItems(
        companyId,
        skip,
        limit,
        search,
        status,
      );

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      throw error;
    }
  }

  async getItemById(id: string, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const itemId = new Types.ObjectId(id);

      const item = await this.itemRepository.findById(itemId, companyId);

      if (!item) {
        throw new NotFoundException('Artículo no encontrado');
      }

      return {
        success: true,
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllItems(request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);

      const items = await this.itemRepository.findAll(companyId);

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(id: string, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);

      const item = await this.itemRepository.findById(
        new Types.ObjectId(id),
        companyId,
      );

      if (!item) {
        throw new NotFoundException('Artículo no encontrado');
      }

      const deletedItem = await this.itemRepository.deleteById(id, companyId);

      return {
        success: true,
        message: 'Artículo eliminado correctamente',
        data: deletedItem,
      };
    } catch (error) {
      throw error;
    }
  }

  async toggleStatusItem(id: string, status: boolean, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const itemId = new Types.ObjectId(id);

      const item = await this.itemRepository.findById(itemId, companyId);

      if (!item) {
        throw new NotFoundException('Artículo no encontrado');
      }

      const updatedItem = await this.itemRepository.toggleStatus(
        itemId,
        companyId,
        status,
      );

      return {
        success: true,
        message: `Artículo ${status ? 'activado' : 'desactivado'} correctamente`,
        data: updatedItem,
      };
    } catch (error) {
      throw error;
    }
  }
}
