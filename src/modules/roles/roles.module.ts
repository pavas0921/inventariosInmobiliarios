import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './schemas/rol.schema';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleExistsValidationPipe } from './pipes/role-exists-validation.pipe'; // 👈 Importar el Pipe

@Module({
  imports: [MongooseModule.forFeature([{ name: Rol.name, schema: RolSchema }])],
  controllers: [RolesController],
  providers: [RolesService, RoleExistsValidationPipe],
})
export class RolesModule {}
