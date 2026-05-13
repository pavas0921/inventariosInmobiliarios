import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from './schemas/owner.schema';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { OwnerRepository } from './owner.repository';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }]),
    UsersModule,
  ],
  controllers: [OwnerController],
  providers: [OwnerService, OwnerRepository],
  exports: [OwnerService],
})
export class OwnerModule {}
