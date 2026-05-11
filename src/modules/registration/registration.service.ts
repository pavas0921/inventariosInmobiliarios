import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RolesService } from '../roles/roles.service';
import { CompanyService } from '../company/company.service';
import { UsersService } from '../users/users.service';
import { generateToken } from '../../common/helpers/token/token-utils';
import { AuthService } from '../auth/auth.service';
import { hashPassword } from '../users/helpers/password-utils';
import { MailService } from '../mail/mail.service';
import { calculateDemoEndDate } from 'src/common/helpers/date/date-utils';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly companyService: CompanyService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async registerDemo(dto: RegisterCompanyDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { company, user } = dto;
      const adminRole = await this.rolesService.findByName('ADMIN');
      const hashedPassword = await hashPassword(user.password);
      const userByDocument = await this.usersService.findUserByDocumentNumber(
        user.documentNumber,
      );

      const userByEmail = await this.usersService.getUserByEmail(user.email);

      if (userByDocument || userByEmail) {
        throw new ConflictException(
          'El número de documento y/o correo electrónico ya se encuentra registrado',
        );
      }

      const existingCompany = await this.companyService.findCompanyByNit(
        company.nit,
      );

      if (existingCompany) {
        throw new ConflictException(
          'La empresa con el NIT proporcionado ya se encuentra registrada',
        );
      }
      const createdCompany = await this.companyService.createCompany(
        company,
        session,
      );

      const createdUser = await this.usersService.createUserRegister(
        {
          ...user,
          password: hashedPassword,
          roles: [adminRole._id],
          companyId: createdCompany._id,
        },
        session,
      );

      const userId = createdUser._id as Types.ObjectId;
      const companyId = createdCompany._id as Types.ObjectId;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const token = generateToken();

      await this.authService.registerActivationToken(
        {
          token,
          userId,
          organizationId: companyId,
          expiresAt,
        },
        session,
      );

      await session.commitTransaction();
      session.endSession();

      await this.mailService.sendActivationEmail({
        to: createdUser.email,
        name: `${createdUser.firstName} ${createdUser.lastName}`,
        activationLink: `http://localhost:3000/organizations/activate/${token}`,
      });

      return {
        company: createdCompany,
        user: createdUser,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }

  async activateDemoOrganization(token: string): Promise<any> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const organization = await this.authService.getTokenAndCompany(
        token,
        session,
      );

      if (!organization) {
        throw new ConflictException('Token de activación inválido o expirado');
      }

      if (organization.used) {
        throw new BadRequestException(
          'El token de activación ya ha sido utilizado y la cuenta se encuentra activa',
        );
      }

      const companyId = organization.organizationId._id as Types.ObjectId;

      // Actualizar token
      await this.authService.updateTokenStatus(token, true, session);

      const demoEndDate = calculateDemoEndDate();

      // Activar compañía
      await this.companyService.activateCompany(
        companyId,
        demoEndDate,
        session,
      );

      // Activar usuario admin
      const updatedUser = await this.usersService.enableUser(
        companyId,
        session,
      );

      if (!updatedUser) {
        throw new Error('No se pudo activar el perfil del usuario');
      }

      await session.commitTransaction();
      session.endSession();

      return {
        organizationId: companyId,
        accountType: 'DEMO',
        demoEndDate,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}
