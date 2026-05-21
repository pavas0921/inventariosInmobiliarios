import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ambient, AmbientSchema } from './schemas/ambient.schema';
import { AmbientService } from './ambient.service';
import { AmbientController } from './ambient.controller';
import { AmbientRepository } from './ambient.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ambient.name, schema: AmbientSchema }]),
    UsersModule,
  ],
  controllers: [AmbientController],
  providers: [AmbientService, AmbientRepository],
  exports: [AmbientService],
})
export class AmbientModule {}
