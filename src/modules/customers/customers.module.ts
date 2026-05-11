import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { UsersModule } from '../users/users.module'; // 👈 IMPORTANTE

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    UsersModule, // 👈 AQUÍ está la solución
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule { }
