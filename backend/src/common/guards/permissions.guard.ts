import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Fetch user with roles and permissions from db
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        }
      }
    });

    if (!dbUser || !dbUser.isActive) return false;

    const userPermissions = new Set<string>();
    let isSuperAdmin = false;

    for (const ur of dbUser.roles) {
      if (ur.role.name === 'Super Admin') {
        isSuperAdmin = true;
        break;
      }
      for (const rp of ur.role.permissions) {
        userPermissions.add(rp.permission.code);
      }
    }

    if (isSuperAdmin) return true;

    const hasAllRequired = requiredPermissions.every(p => userPermissions.has(p));
    if (!hasAllRequired) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
