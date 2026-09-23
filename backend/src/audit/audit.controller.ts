import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { getPaginationOptions, buildPaginatedResult } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('audit-logs')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private prisma: PrismaService
  ) {}

  @Get()
  @RequirePermissions('audit.view')
  @ApiOperation({ summary: 'Get all audit logs' })
  async findAll(@Query() query: PaginationDto & { userId?: string, action?: string, startDate?: string, endDate?: string }) {
    const { skip, take, orderBy } = getPaginationOptions(query);
    
    const where: Prisma.AuditLogWhereInput = {};
    
    if (query.userId) where.userId = query.userId;
    if (query.action) where.action = { contains: query.action, mode: 'insensitive' };
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where, skip, take, orderBy: orderBy || { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      this.prisma.auditLog.count({ where })
    ]);

    return buildPaginatedResult(data, total, query);
  }
}
