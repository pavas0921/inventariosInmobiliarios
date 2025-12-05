import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  companyName: string;

  @IsString()
  nit: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  responsibleName: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
