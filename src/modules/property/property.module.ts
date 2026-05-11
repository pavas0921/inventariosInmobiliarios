import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Property.name,
        schema: PropertySchema,
      },
    ]),
    UsersModule,
  ],
  providers: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {}
