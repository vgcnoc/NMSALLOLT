import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailForAuth(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any): Promise<LoginResponse> {
    // Load user roles and permissions
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const roles = userWithRoles?.roles.map((ur) => ur.role.name) || [];
    const permissions = [
      ...new Set(
        userWithRoles?.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.code),
        ) || [],
      ),
    ];

    const payload = {
      sub: user.id,
      email: user.email,
      roles,
      permissions,
    };

    const tokens = await this.generateTokens(payload);

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        permissions,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const roles = user.roles.map((ur) => ur.role.name);
      const permissions = [
        ...new Set(
          user.roles.flatMap((ur) =>
            ur.role.permissions.map((rp) => rp.permission.code),
          ),
        ),
      ];

      const newPayload = {
        sub: user.id,
        email: user.email,
        roles,
        permissions,
      };

      return this.generateTokens(newPayload);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      ...user,
      roles: user.roles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
      })),
      permissions: [
        ...new Set(
          user.roles.flatMap((ur) =>
            ur.role.permissions.map((rp) => rp.permission.code),
          ),
        ),
      ],
    };
  }

  private async generateTokens(payload: any): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
