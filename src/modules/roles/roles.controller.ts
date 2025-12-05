import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common';
import { RoleExistsValidationPipe } from './pipes/role-exists-validation.pipe';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}
  @Post()
  @UsePipes(RoleExistsValidationPipe)
  async create(@Body() createRolDto: CreateRolDto) {
    return this.roleService.create(createRolDto);
  }

  @Get()
  async findAll() {
    return this.roleService.findAllRoles();
  }
}
