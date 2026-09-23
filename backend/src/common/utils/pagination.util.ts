import { PaginationDto } from '../dto/pagination.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function getPaginationOptions(dto: PaginationDto) {
  const page = dto.page || 1;
  const limit = dto.limit || 20;
  const skip = (page - 1) * limit;

  let orderBy: any = undefined;
  if (dto.sortBy) {
    orderBy = { [dto.sortBy]: dto.sortOrder || 'asc' };
  }

  return { skip, take: limit, orderBy };
}

export function buildPaginatedResult<T>(data: T[], total: number, dto: PaginationDto): PaginatedResult<T> {
  const page = dto.page || 1;
  const limit = dto.limit || 20;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  };
}
