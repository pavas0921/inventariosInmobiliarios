import { CustomerType } from 'src/common/enums/customer-types.enum';
import { DocumentType } from 'src/common/enums/document-types.enum';

export class CustomerResponseDto {
    id: string;

    firstName: string;
    lastName: string;

    documentType: DocumentType;
    documentNumber: string;

    primaryPhone: string;
    secondaryPhone?: string;

    address: string;
    email: string;

    ownerType: CustomerType[];

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}
