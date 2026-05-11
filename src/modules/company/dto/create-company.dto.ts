import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Hello Odontología S.A.S' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: '900123456-7' })
  @IsString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty({ example: 'Cra 43A #10-50' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+57 3001234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'contacto@helloodontologia.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Andrés Pavas' })
  @IsString()
  @IsNotEmpty()
  responsibleName: string;

  @ApiProperty({ example: 'Medellín' })
  @IsString()
  @IsNotEmpty()
  city: string;
}
