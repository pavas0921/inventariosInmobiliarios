import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from './tenant.repository';
import { CreateTenantDto } from './dto/create-tenant-dto';
import { Types } from 'mongoose';
import { UpdateTenantDto } from './dto/update-tenant-dto';
import { SearchTenantDto } from './dto/search-tenant-dto';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async createTenant(dto: CreateTenantDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    const existingByEmail = await this.tenantRepository.findByEmail(
      dto.email,
      companyId,
    );

    if (existingByEmail) {
      throw new ConflictException(
        'Ya existe un inquilino registrado con el correo electrónico ' +
          dto.email,
      );
    }

    const existingByDocument = await this.tenantRepository.findByDocument(
      dto.documentNumber,
      companyId,
    );

    if (existingByDocument) {
      throw new ConflictException(
        'Ya existe un inquilino registrado con el número de documento proporcionado',
      );
    }

    const tenant = await this.tenantRepository.create({
      ...dto,
      companyId,
    });

    return {
      success: true,
      data: tenant,
    };
  }

  async updateTenant(id: string, dto: UpdateTenantDto, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const tenantId = id;

      const existingTenant = await this.tenantRepository.findByDocument(
        tenantId,
        companyId,
      );

      console.log(existingTenant);

      if (!existingTenant) {
        throw new NotFoundException('Inquilino no encontrado');
      }

      if (dto.email && dto.email !== existingTenant.email) {
        const emailExists = await this.tenantRepository.findByEmail(
          dto.email,
          companyId,
        );

        if (emailExists) {
          throw new ConflictException(
            'Ya existe un inquilino con este correo electrónico',
          );
        }
      }

      if (
        dto.documentNumber &&
        dto.documentNumber !== existingTenant.documentNumber
      ) {
        const docExists = await this.tenantRepository.findByDocument(
          dto.documentNumber,
          companyId,
        );

        if (docExists) {
          throw new ConflictException(
            'Ya existe un inquilino con este documento',
          );
        }
      }

      const updatedTenant = await this.tenantRepository.update(
        tenantId,
        companyId,
        dto,
      );

      return {
        success: true,
        message: 'Inquilino actualizado correctamente',
        data: updatedTenant,
      };
    } catch (error) {
      throw error;
    }
  }

  async searchTenants(request: any, query: SearchTenantDto) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const { skip = 0, limit = 10, search, documentType, status } = query;

      const result = await this.tenantRepository.searchTenants(
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
