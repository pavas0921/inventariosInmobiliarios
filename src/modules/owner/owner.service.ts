import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OwnerRepository } from './owner.repository';
import { CreateOwnerDto } from './dto/create-owner-dto';
import { Types } from 'mongoose';
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { SearchOwnerDto } from './dto/search-owner-dto';

@Injectable()
export class OwnerService {
  constructor(private readonly ownerRepository: OwnerRepository) {}

  async createOwner(dto: CreateOwnerDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    const existingByEmail = await this.ownerRepository.findByEmail(
      dto.email,
      companyId,
    );

    if (existingByEmail) {
      throw new ConflictException(
        'Ya existe un propietario registrado con el correo electrónico ' +
          dto.email,
      );
    }

    const existingByDocument = await this.ownerRepository.findByDocument(
      dto.documentNumber,
      companyId,
    );

    if (existingByDocument) {
      throw new ConflictException(
        'Ya existe un propietario registrado con el número de documento proporcionado',
      );
    }

    const owner = await this.ownerRepository.create({
      ...dto,
      companyId,
    });

    return {
      success: true,
      data: owner,
    };
  }

  async updateOwner(id: string, dto: UpdateOwnerDto, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const ownerId = id;

      const existingOwner = await this.ownerRepository.findByDocument(
        ownerId,
        companyId,
      );

      console.log(existingOwner);

      if (!existingOwner) {
        throw new NotFoundException('Propietario no encontrado');
      }

      if (dto.email && dto.email !== existingOwner.email) {
        const emailExists = await this.ownerRepository.findByEmail(
          dto.email,
          companyId,
        );

        if (emailExists) {
          throw new ConflictException(
            'Ya existe un propietario con este correo electrónico',
          );
        }
      }

      if (
        dto.documentNumber &&
        dto.documentNumber !== existingOwner.documentNumber
      ) {
        const docExists = await this.ownerRepository.findByDocument(
          dto.documentNumber,
          companyId,
        );

        if (docExists) {
          throw new ConflictException(
            'Ya existe un propietario con este documento',
          );
        }
      }

      const updatedOwner = await this.ownerRepository.update(
        ownerId,
        companyId,
        dto,
      );

      return {
        success: true,
        message: 'Propietario actualizado correctamente',
        data: updatedOwner,
      };
    } catch (error) {
      throw error;
    }
  }

  async searchOwners(request: any, query: SearchOwnerDto) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const { skip = 0, limit = 10, search, documentType, status } = query;

      const result = await this.ownerRepository.searchOwners(
        companyId,
        skip,
        limit,
        search,
        documentType,
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
