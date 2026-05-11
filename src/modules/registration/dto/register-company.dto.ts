import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';
import { CreateUserDemoDto } from '../../users/dto/create-user-demo.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCompanyDto {
  @ApiProperty({ type: CreateCompanyDto })
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;

  @ApiProperty({ type: CreateUserDemoDto })
  @ValidateNested()
  @Type(() => CreateUserDemoDto)
  user: CreateUserDemoDto;
}
