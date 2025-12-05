import { IsNotEmpty, IsString } from 'class-validator';

export class FindRolByName {
  @IsString()
  @IsNotEmpty()
  rolName: string;
}
