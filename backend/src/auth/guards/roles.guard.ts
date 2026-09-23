import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
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

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } }
        }
      }
    });

    if (!dbUser) return false;

    const userPermissions = dbUser.roles.flatMap(r => r.role.permissions.map(p => p.permission.code));
    const isSuperAdmin = dbUser.roles.some(r => r.role.name === 'Super Admin');

    if (isSuperAdmin) return true;

    const hasPermission = requiredPermissions.every(rp => userPermissions.includes(rp));
    if (!hasPermission) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
