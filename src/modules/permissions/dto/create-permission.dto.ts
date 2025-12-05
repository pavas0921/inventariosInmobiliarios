import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  permissionName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  permissionDescription: string;
}
