// src/modules/registration/registration.module.ts
import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { RolesModule } from '../roles/roles.module';
import { CompanyModule } from '../company/company.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [RolesModule, CompanyModule, UsersModule, AuthModule, MailModule],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
