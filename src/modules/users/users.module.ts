import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schemas';
import { Rol, RolSchema } from '../roles/schemas/rol.schema';
import {
  Permission,
  PermissionSchema,
} from '../permissions/schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Rol.name, schema: RolSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
