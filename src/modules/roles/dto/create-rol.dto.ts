import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  rolName: string;

  @IsString()
  @IsNotEmpty()
  rolDescription: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe asignar al menos un permiso al rol' })
  permissionIds: string[];
}
