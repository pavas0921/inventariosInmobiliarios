import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventoryHeader,
  InventoryHeaderSchema,
} from './schemas/inventory-header.schemas';
import { InventoryHeaderService } from './inventory-header.service';
import { InventoryHeaderController } from './inventory-header.controller';
import { InventoryHeaderRepository } from './inventory-header.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryHeader.name, schema: InventoryHeaderSchema },
    ]),
    UsersModule,
  ],
  controllers: [InventoryHeaderController],
  providers: [InventoryHeaderService, InventoryHeaderRepository],
  exports: [InventoryHeaderService],
})
export class InventoryHeaderModule {}
