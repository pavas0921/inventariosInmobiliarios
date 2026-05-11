import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { DocumentType } from 'src/common/enums/document-types.enum';

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel(Customer.name)
        private readonly customerModel: Model<Customer>,
    ) { }

    /**
     * Crear un cliente dentro de la empresa del usuario autenticado
     */
    async create(
        dto: CreateCustomerDto,
        user: UserPayload,
    ): Promise<CustomerResponseDto> {
        // 1️⃣ Validar que no exista el cliente en la empresa

        const existingCustomer = await this.findByDocumentAndCompany(
            dto.documentType,
            dto.documentNumber,
            user.companyId,
        );

        if (existingCustomer) {
            throw new BadRequestException(
                'Ya existe un cliente con este documento en la empresa',
            );
        }

        // 2️⃣ Crear cliente
        const customer = await this.customerModel.create({
            ...dto,
            companyId: user.companyId,
            isActive: true,
        });

        // 3️⃣ Retornar DTO de respuesta
        return this.toResponseDto(customer);
    }

    /**
     * Buscar cliente por documento + empresa
     * (método reutilizable)
     */
    async findByDocumentAndCompany(
        documentType: DocumentType,
        documentNumber: string,
        companyId: string,
    ): Promise<Customer | null> {
        return this.customerModel.findOne({
            documentType,
            documentNumber,
            companyId,
            isActive: true,
        });
    }

    /**
     * Mapper: Entity → Response DTO
     * Centraliza el formato de salida
     */
    private toResponseDto(customer: Customer): CustomerResponseDto {
        return {
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            documentType: customer.documentType as DocumentType,
            documentNumber: customer.documentNumber,
            primaryPhone: customer.primaryPhone,
            secondaryPhone: customer.secondaryPhone,
            address: customer.address,
            email: customer.email,
            ownerType: customer.ownerType,
            isActive: customer.isActive,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        };
    }
}
