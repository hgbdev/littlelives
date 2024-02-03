import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  SetQuotaDto,
} from './user.dto';
import { DEFAULT_QUOTA } from 'src/utils/contants';
import { Role } from '@prisma/client';
import { checkPasswordMatch, hashPassword } from 'src/utils/helpers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getUser(username: string, hasPassword?: boolean) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        currentUsage: true,
        role: true,
        quota: true,
        createdAt: true,
        updatedAt: true,
        password: hasPassword ? true : false,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async initAdmin() {
    const user = await this.getUser('admin');

    if (user) {
      return null;
    }

    return this.createUser(
      { username: 'admin', password: 'admin' },
      Role.ADMIN,
    );
  }

  async login(data: LoginDto) {
    const user = await this.getUser(data.username, true);
    if (!user) {
      return null;
    }

    const valid = await checkPasswordMatch(data.password, user.password);
    if (!valid) {
      return null;
    }

    const token = await this.jwtService.signAsync({
      username: user.username,
      role: user.role,
    });

    return {
      token,
      username: user.username,
      role: user.role,
    };
  }

  async createUser(data: CreateUserDto, role?: Role) {
    const user = await this.getUser(data.username);
    if (user) {
      return null;
    }

    return this.prisma.user.create({
      data: {
        username: data.username,
        password: await hashPassword(data.password),
        role: role || Role.USER,
        quota: DEFAULT_QUOTA,
      },
      select: {
        id: true,
        username: true,
        role: true,
        quota: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(data: ChangePasswordDto) {
    const user = await this.getUser(data.username, true);
    if (!user) {
      return null;
    }

    const valid = await checkPasswordMatch(data.oldPassword, user.password);
    if (!valid) {
      return null;
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await hashPassword(data.password),
      },
    });
  }

  async checkQuota(fileSize: number, username: string) {
    const user = await this.getUser(username);
    if (!user) {
      return null;
    }

    if (fileSize + user.currentUsage > user.quota) {
      return false;
    }

    return true;
  }

  async setQuota(data: SetQuotaDto) {
    const user = await this.getUser(data.username);
    if (!user) {
      return null;
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        quota: data.quota,
      },
    });
  }

  async increaseUsage(username: string, amount: number) {
    const user = await this.getUser(username);
    if (!user) {
      return null;
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        currentUsage: {
          increment: amount,
        },
      },
    });
  }

  async decreaseUsage(username: string, amount: number) {
    const user = await this.getUser(username);
    if (!user) {
      return null;
    }

    // if quota is less than amount, set it to 0
    if (user.quota < amount) {
      return this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          quota: 0,
        },
      });
    } else {
      return this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          currentUsage: {
            decrement: amount,
          },
        },
      });
    }
  }
}
