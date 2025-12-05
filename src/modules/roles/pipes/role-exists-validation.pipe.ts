import { Injectable, PipeTransform, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rol } from '../schemas/rol.schema'; // Asegúrate de que la ruta sea correcta
import { CreateRolDto } from '../dto/create-rol.dto';

@Injectable()
export class RoleExistsValidationPipe implements PipeTransform {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) {}

  async transform(createRolDto: CreateRolDto): Promise<CreateRolDto> {
    // Puedes tiparlo con `CreateRolDto` si lo prefieres
    const { rolName } = createRolDto;
    const roleExists = await this.rolModel.findOne({ rolName });

    if (roleExists) {
      throw new ConflictException({
        message: 'El nombre del rol ya está en uso',
        existingRole: roleExists,
      });
    }

    return createRolDto;
  }
}
