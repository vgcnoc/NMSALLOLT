import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: { id: true, name: true, email: true, isActive: true, lastLogin: true, roles: { include: { role: true } } }
    });
    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, isActive: true, lastLogin: true, roles: { include: { role: true } } }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() }
    });
  }

  async remove(id: string) {
    // Soft delete
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
