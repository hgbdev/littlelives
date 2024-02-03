import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { businessResponse } from 'src/utils/helpers';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  SetQuotaDto,
} from './user.dto';
import { AuthGuard } from './user.guard';
import { Role } from '@prisma/client';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init-admin')
  async initAdmin() {
    const admin = await this.userService.initAdmin();
    if (!admin) {
      throw new BadRequestException('Failed to init admin');
    }

    return businessResponse('Init admin success');
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.userService.login(data);
    if (!user) {
      throw new BadRequestException('Failed to login, invalid credentials');
    }

    return businessResponse('Login success', 200, user);
  }

  @Post('register')
  async createUser(@Body() data: CreateUserDto) {
    const user = await this.userService.createUser(data);
    if (!user) {
      throw new BadRequestException(
        'Failed to create user, user already exists',
      );
    }

    return businessResponse('Create user success', 201, {
      username: user.username,
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async me(@Req() req: any) {
    const user = await this.userService.getUser(req.user.username);

    return businessResponse('Get me success', 200, user);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async changePassword(@Body() data: ChangePasswordDto) {
    const user = await this.userService.changePassword(data);
    if (!user) {
      throw new BadRequestException(
        'Failed to change password, password not valid',
      );
    }

    return businessResponse('Change password success', 200);
  }

  @Post('set-quota')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async setQuota(@Body() data: SetQuotaDto, @Req() req: any) {
    if (req.user.role !== Role.ADMIN) {
      throw new BadRequestException('Only admin can set quota');
    }

    const user = await this.userService.setQuota(data);
    if (!user) {
      throw new BadRequestException('Failed to set quota');
    }

    return businessResponse('Set quota success', 200);
  }
}
