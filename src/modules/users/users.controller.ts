import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailPasswordDto } from './dto/find-user-by-email-password.dto';
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions-guard';
import { RequirePermissions } from '../auth/decorators/permission.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserPasswordDto } from './dto/change-password.dto';
import { ToggleUserStatusDto } from './dto/toggle-user-status.dto';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_USER')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userResponse = await this.usersService.createUser(createUserDto, req);
    if (userResponse.success) {
      return res.status(HttpStatus.CREATED).json(userResponse);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(userResponse);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('status')
  @RequirePermissions('TOGGLE_USER_STATUS')
  @UsePipes(new ValidationPipe())
  async toggleUserStatus(
    @Body() dto: ToggleUserStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const response = await this.usersService.toggleUserStatus(dto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id')
  @RequirePermissions('UPDATE_USER')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Actualizar usuario' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.usersService.updateUser(id, updateUserDto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('change-password')
  @RequirePermissions('CHANGE_USER_PASSWORD')
  @UsePipes(new ValidationPipe())
  async changeUserPassword(
    @Body() dto: ChangeUserPasswordDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const response = await this.usersService.changeUserPassword(dto, req);

    if (response.success) {
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @Public()
  @Post('login')
  async getUserForAuth(
    @Body() findUserByEmailPasswordDto: FindUserByEmailPasswordDto,
  ) {
    return this.usersService.findUserByEmail(findUserByEmailPasswordDto);
  }
}
