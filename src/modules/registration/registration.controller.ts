import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Public()
  @Post('demo')
  @ApiOperation({
    summary: 'Registro de empresa demo con usuario administrador',
  })
  @ApiBody({
    type: RegisterCompanyDto,
    examples: {
      example1: {
        summary: 'Ejemplo de registro',
        value: {
          company: {
            companyName: 'Hello Odontología S.A.S',
            nit: '900123456-7',
            address: 'Cra 43A #10-50',
            phone: '+57 3001234567',
            email: 'contacto@helloodontologia.com',
            responsibleName: 'Andrés Pavas',
            city: 'Medellín',
          },
          user: {
            firstName: 'Andrés',
            lastName: 'Pavas',
            documentNumber: '123456789',
            email: 'admin@helloodontologia.com',
            password: 'Demo123*',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cuenta demo creada exitosamente',
  })
  async registerDemo(@Body() dto: RegisterCompanyDto) {
    const result = await this.registrationService.registerDemo(dto);

    return {
      message: 'Demo account created successfully',
      data: result,
    };
  }

  @Public()
  @Get('activate/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activar organización demo' })
  @ApiOkResponse({
    description: 'Organización activada correctamente',
  })
  async activateOrganization(@Param('token') token: string) {
    return this.registrationService.activateDemoOrganization(token);
  }
}
