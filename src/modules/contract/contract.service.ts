import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContractRepository } from './contract.repository';
import { CreateContractDto } from './dto/create-contract-dto';
import { Types } from 'mongoose';
import { UpdateContractDto } from './dto/update-contract-dto';
import { SearchContractDto } from './dto/search-contract-dto';

@Injectable()
export class ContractService {
  constructor(private readonly contractRepository: ContractRepository) {}

  async createContract(dto: CreateContractDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    // Validar que las fechas sean válidas
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de término',
      );
    }

    // Verificar que el número de contrato no exista
    const existingByNumber = await this.contractRepository.findByContractNumber(
      dto.contractNumber,
      companyId,
    );

    if (existingByNumber) {
      throw new ConflictException(
        'Ya existe un contrato registrado con el número ' + dto.contractNumber,
      );
    }

    const contract = await this.contractRepository.create({
      ...dto,
      propertyId: new Types.ObjectId(dto.propertyId),
      ownerId: new Types.ObjectId(dto.ownerId),
      tenantId: new Types.ObjectId(dto.tenantId),
      startDate,
      endDate,
      companyId,
    });

    return {
      success: true,
      data: contract,
    };
  }

  async updateContract(id: string, dto: UpdateContractDto, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);

      const existingContract = await this.contractRepository.findById(
        id,
        companyId,
      );

      if (!existingContract) {
        throw new NotFoundException('Contrato no encontrado');
      }

      // Validar fechas si se proporcionan
      if (dto.startDate && dto.endDate) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        if (startDate >= endDate) {
          throw new BadRequestException(
            'La fecha de inicio debe ser anterior a la fecha de término',
          );
        }
      }

      // Verificar número de contrato único si se proporciona
      if (
        dto.contractNumber &&
        dto.contractNumber !== existingContract.contractNumber
      ) {
        const numberExists = await this.contractRepository.findByContractNumber(
          dto.contractNumber,
          companyId,
        );

        if (numberExists) {
          throw new ConflictException('Ya existe un contrato con este número');
        }
      }

      const updateData: any = { ...dto };

      // Convertir IDs de string a ObjectId
      if (dto.propertyId) {
        updateData.propertyId = new Types.ObjectId(dto.propertyId);
      }
      if (dto.ownerId) {
        updateData.ownerId = new Types.ObjectId(dto.ownerId);
      }
      if (dto.tenantId) {
        updateData.tenantId = new Types.ObjectId(dto.tenantId);
      }

      const updatedContract = await this.contractRepository.update(
        id,
        companyId,
        updateData,
      );

      return {
        success: true,
        message: 'Contrato actualizado correctamente',
        data: updatedContract,
      };
    } catch (error) {
      throw error;
    }
  }

  async searchContracts(request: any, query: SearchContractDto) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const {
        skip = 0,
        limit = 10,
        search,
        propertyId,
        ownerId,
        tenantId,
        status,
      } = query;

      const result = await this.contractRepository.searchContracts(
        companyId,
        skip,
        limit,
        search,
        propertyId,
        ownerId,
        tenantId,
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
