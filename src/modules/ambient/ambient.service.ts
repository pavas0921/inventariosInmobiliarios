import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AmbientRepository } from './ambient.repository';
import { CreateAmbientDto } from './dto/create-ambient-dto';
import { Types } from 'mongoose';
import { UpdateAmbientDto } from './dto/update-ambient-dto';
import { SearchAmbientDto } from './dto/search-ambient-dto';
import { capitalize } from '../../common/helpers/string/string-utils';

@Injectable()
export class AmbientService {
  constructor(private readonly ambientRepository: AmbientRepository) {}

  async createAmbient(dto: CreateAmbientDto, request: any) {
    const companyId = new Types.ObjectId(request.user.companyId);

    // Capitalizar el nombre
    const capitalizedName = capitalize(dto.name.trim());

    const existingByName = await this.ambientRepository.findByName(
      capitalizedName,
      companyId,
    );

    if (existingByName) {
      throw new ConflictException(
        'Ya existe un ambiente registrado con el nombre ' + capitalizedName,
      );
    }

    const ambient = await this.ambientRepository.create({
      ...dto,
      name: capitalizedName,
      companyId,
    });

    return {
      success: true,
      data: ambient,
    };
  }

  async updateAmbient(id: string, dto: UpdateAmbientDto, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const ambientId = new Types.ObjectId(id);

      const existingAmbient = await this.ambientRepository.findById(
        ambientId,
        companyId,
      );

      if (!existingAmbient) {
        throw new NotFoundException('Ambiente no encontrado');
      }

      const updateData: any = {};

      if (dto.name) {
        const capitalizedName = capitalize(dto.name.trim());

        if (capitalizedName !== existingAmbient.name) {
          const nameExists = await this.ambientRepository.findByName(
            capitalizedName,
            companyId,
          );

          if (nameExists) {
            throw new ConflictException(
              'Ya existe un ambiente con este nombre',
            );
          }
        }

        updateData.name = capitalizedName;
      }

      const updatedAmbient = await this.ambientRepository.update(
        id,
        companyId,
        updateData,
      );

      return {
        success: true,
        message: 'Ambiente actualizado correctamente',
        data: updatedAmbient,
      };
    } catch (error) {
      throw error;
    }
  }

  async searchAmbients(request: any, query: SearchAmbientDto) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const { skip = 0, limit = 10, search, status } = query;

      const result = await this.ambientRepository.searchAmbients(
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

  async getAmbientById(id: string, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const ambientId = new Types.ObjectId(id);

      const ambient = await this.ambientRepository.findById(
        ambientId,
        companyId,
      );

      if (!ambient) {
        throw new NotFoundException('Ambiente no encontrado');
      }

      return {
        success: true,
        data: ambient,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllAmbients(request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);

      const ambients = await this.ambientRepository.findAll(companyId);

      return {
        success: true,
        data: ambients,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteAmbient(id: string, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);

      const ambient = await this.ambientRepository.findById(
        new Types.ObjectId(id),
        companyId,
      );

      if (!ambient) {
        throw new NotFoundException('Ambiente no encontrado');
      }

      const deletedAmbient = await this.ambientRepository.deleteById(
        id,
        companyId,
      );

      return {
        success: true,
        message: 'Ambiente eliminado correctamente',
        data: deletedAmbient,
      };
    } catch (error) {
      throw error;
    }
  }

  async toggleStatusAmbient(id: string, status: boolean, request: any) {
    try {
      const companyId = new Types.ObjectId(request.user.companyId);
      const ambientId = new Types.ObjectId(id);

      const ambient = await this.ambientRepository.findById(
        ambientId,
        companyId,
      );

      if (!ambient) {
        throw new NotFoundException('Ambiente no encontrado');
      }

      const updatedAmbient = await this.ambientRepository.toggleStatus(
        ambientId,
        companyId,
        status,
      );

      return {
        success: true,
        message: `Ambiente ${status ? 'activado' : 'desactivado'} correctamente`,
        data: updatedAmbient,
      };
    } catch (error) {
      throw error;
    }
  }
}
