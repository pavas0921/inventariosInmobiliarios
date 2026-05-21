import { PartialType } from '@nestjs/swagger';
import { CreateContractDto } from './create-contract-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { ContractStatus } from '../schemas/contract.schema';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @ApiPropertyOptional({
    enum: ContractStatus,
    description: 'Estado del contrato',
  })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
