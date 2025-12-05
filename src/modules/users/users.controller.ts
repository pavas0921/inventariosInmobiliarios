import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailPasswordDto } from './dto/find-user-by-email-password.dto';

import { Response } from 'express';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key-guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const userResponse = await this.usersService.createUser(createUserDto);
    if (userResponse.success) {
      return res.status(HttpStatus.CREATED).json(userResponse);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(userResponse);
    }
  }

  @Post('login')
  async getUserForAuth(
    @Body() findUserByEmailPasswordDto: FindUserByEmailPasswordDto,
  ) {
    return this.usersService.findUserByEmail(findUserByEmailPasswordDto);
  }
}
