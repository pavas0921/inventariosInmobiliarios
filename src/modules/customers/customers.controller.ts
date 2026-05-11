import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { User } from '../auth/decorators/user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';


@ApiTags('Customers')
@ApiBearerAuth('bearer')
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }


    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Post()
    @ApiCreatedResponse({
        description: 'Customer created successfully',
        type: CustomerResponseDto,
    })
    async create(
        @Body() dto: CreateCustomerDto,
        @User() user: UserPayload,
    ): Promise<CustomerResponseDto> {
        return this.customersService.create(dto, user);
    }
}
