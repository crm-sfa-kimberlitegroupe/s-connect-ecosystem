import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OutletsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    status?: string;
    territoryId?: string;
    channel?: string;
    proposedBy?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.territoryId) {
      where.territoryId = filters.territoryId;
    }

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    if (filters?.proposedBy) {
      where.proposedBy = filters.proposedBy;
    }

    return this.prisma.outlet.findMany({
      where,
      include: {
        territory: true,
        proposer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        validator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyTerritoryOutlets(filters?: {
    status?: string;
    channel?: string;
  }) {
    // This will be called with the user from JWT
    // For now, return all outlets
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    return this.prisma.outlet.findMany({
      where,
      include: {
        territory: true,
        proposer: true,
        validator: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const outlet = await this.prisma.outlet.findUnique({
      where: { id },
      include: {
        territory: true,
        proposer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        validator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!outlet) {
      throw new NotFoundException('Outlet not found');
    }

    return outlet;
  }

  async create(data: any) {
    // Check if code exists
    const existingCode = await this.prisma.outlet.findUnique({
      where: { code: data.code },
    });

    if (existingCode) {
      throw new ConflictException('Outlet code already exists');
    }

    // Set proposedBy from JWT if not provided
    // For now, we'll use a default or provided value

    return this.prisma.outlet.create({
      data: {
        ...data,
        status: data.status || 'PENDING',
      },
      include: {
        territory: true,
        proposer: true,
      },
    });
  }

  async update(id: string, data: any) {
    const outlet = await this.findById(id);

    if (data.code && data.code !== outlet.code) {
      const existingCode = await this.prisma.outlet.findUnique({
        where: { code: data.code },
      });

      if (existingCode) {
        throw new ConflictException('Outlet code already exists');
      }
    }

    return this.prisma.outlet.update({
      where: { id },
      data,
      include: {
        territory: true,
        proposer: true,
        validator: true,
      },
    });
  }

  async approve(id: string, userId?: string) {
    const outlet = await this.findById(id);

    if (outlet.status !== 'PENDING') {
      throw new ConflictException('Outlet can only be approved when pending');
    }

    return this.prisma.outlet.update({
      where: { id },
      data: {
        status: 'APPROVED',
        validatedBy: userId,
        validatedAt: new Date(),
      },
    });
  }

  async reject(id: string, reason?: string, userId?: string) {
    const outlet = await this.findById(id);

    if (outlet.status !== 'PENDING') {
      throw new ConflictException('Outlet can only be rejected when pending');
    }

    return this.prisma.outlet.update({
      where: { id },
      data: {
        status: 'REJECTED',
        validatedBy: userId,
        validatedAt: new Date(),
        validationComment: reason,
      },
    });
  }

  async delete(id: string) {
    const outlet = await this.findById(id);

    // Check if outlet has orders or visits
    const ordersCount = await this.prisma.order.count({
      where: { outletId: id },
    });

    const visitsCount = await this.prisma.visit.count({
      where: { outletId: id },
    });

    if (ordersCount > 0 || visitsCount > 0) {
      throw new ConflictException('Cannot delete outlet with associated orders or visits');
    }

    return this.prisma.outlet.delete({
      where: { id },
    });
  }

  async getStats(filters?: {
    territoryId?: string;
    proposedBy?: string;
  }) {
    const where: any = {};

    if (filters?.territoryId) {
      where.territoryId = filters.territoryId;
    }

    if (filters?.proposedBy) {
      where.proposedBy = filters.proposedBy;
    }

    const total = await this.prisma.outlet.count({ where });
    const pending = await this.prisma.outlet.count({
      where: { ...where, status: 'PENDING' },
    });
    const approved = await this.prisma.outlet.count({
      where: { ...where, status: 'APPROVED' },
    });
    const rejected = await this.prisma.outlet.count({
      where: { ...where, status: 'REJECTED' },
    });
    const inactive = await this.prisma.outlet.count({
      where: { ...where, status: 'INACTIVE' },
    });

    return {
      total,
      pending,
      approved,
      rejected,
      inactive,
    };
  }
}