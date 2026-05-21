import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryHeaderRepository } from './inventory-header.repository';
import { CreateInventoryHeaderDto } from './dto/create-inventory-header-dto';
import { Types } from 'mongoose';
import { UpdateInventoryHeaderDto } from './dto/update-inventory-header-dto';
import { SearchInventoryHeaderDto } from './dto/search-inventory-header-dto';

@Injectable()
export class InventoryHeaderService {
  constructor(
    private readonly inventoryHeaderRepository: InventoryHeaderRepository,
  ) {}

  async createInventoryHeader(dto: CreateInventoryHeaderDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);
    const userId = new Types.ObjectId(request.user.id);
    const contractId = new Types.ObjectId(dto.contractId);

    const existingInventory =
      await this.inventoryHeaderRepository.searchInventoryHeadersByContractId(
        contractId,
        companyId,
      );

    if (existingInventory.find((i) => i.inventoryType === dto.inventoryType)) {
      throw new ConflictException(
        `Ya existe un inventario de tipo ${dto.inventoryType} para este contrato`,
      );
    }

    const inventoryDate = new Date(dto.inventoryDate);

    const inventoryHeader = await this.inventoryHeaderRepository.create({
      ...dto,
      contractId: new Types.ObjectId(dto.contractId),
      inventoryDate,
      createdBy: userId,
      companyId,
    });

    return {
      success: true,
      data: inventoryHeader,
    };
  }

  async updateInventoryHeader(
    id: string,
    dto: UpdateInventoryHeaderDto,
    request: any,
  ) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);

      const existingInventory = await this.inventoryHeaderRepository.findById(
        id,
        companyId,
      );

      if (!existingInventory) {
        throw new NotFoundException('Inventario no encontrado');
      }

      if (existingInventory.status === 'COMPLETED') {
        throw new BadRequestException(
          'El inventario ya fue completado y no puede modificarse',
        );
      }

      const updateData: any = { ...dto };

      // Convertir IDs de string a ObjectId si se proporcionan
      if (dto.contractId) {
        updateData.contractId = new Types.ObjectId(dto.contractId);
      }

      if (dto.inventoryDate) {
        updateData.inventoryDate = new Date(dto.inventoryDate);
      }

      const updatedInventory = await this.inventoryHeaderRepository.update(
        id,
        companyId,
        updateData,
      );

      return {
        success: true,
        message: 'Inventario actualizado correctamente',
        data: updatedInventory,
      };
    } catch (error) {
      throw error;
    }
  }

  async searchInventoryHeaders(request: any, query: SearchInventoryHeaderDto) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const { skip = 0, limit = 10, contractId, inventoryType, status } = query;

      const result =
        await this.inventoryHeaderRepository.searchInventoryHeaders(
          companyId,
          skip,
          limit,
          contractId,
          inventoryType,
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
}
