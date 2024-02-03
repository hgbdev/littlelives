import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Max(50)
  @Min(3)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(50)
  @Min(3)
  password: string;
}

export class LoginDto extends CreateUserDto {}

export class ChangePasswordDto extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Max(50)
  @Min(3)
  oldPassword: string;
}

export class SetQuotaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quota: number;

  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
