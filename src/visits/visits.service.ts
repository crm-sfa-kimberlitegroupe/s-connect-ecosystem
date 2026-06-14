import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto, VisitStatus } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createVisitDto: CreateVisitDto) {
    const { outletId, plannedDate, notes, status } = createVisitDto;

    // Vérifier que l'outlet existe
    const outlet = await this.prisma.outlet.findUnique({
      where: { id: outletId },
    });

    if (!outlet) {
      throw new NotFoundException('Outlet not found');
    }

    // Créer la visite
    return this.prisma.visit.create({
      data: {
        outletId,
        userId,
        plannedDate: plannedDate ? new Date(plannedDate) : undefined,
        notes,
        status: status || VisitStatus.PLANNED,
      },
      include: {
        outlet: true,
        user: true,
      },
    });
  }

  async findAll(userId: string) {
    // Retourner toutes les visites de l'utilisateur
    return this.prisma.visit.findMany({
      where: { userId },
      include: {
        outlet: true,
        orders: true,
        merchChecks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      include: {
        outlet: true,
        user: true,
        orders: true,
        merchChecks: true,
      },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (visit.userId !== userId) {
      throw new ForbiddenException('You can only access your own visits');
    }

    return visit;
  }

  async update(id: string, userId: string, updateVisitDto: UpdateVisitDto) {
    // Vérifier que la visite existe et appartient à l'utilisateur
    await this.findOne(id, userId);

    return this.prisma.visit.update({
      where: { id },
      data: {
        ...updateVisitDto,
        checkinAt: updateVisitDto.checkinAt ? new Date(updateVisitDto.checkinAt) : undefined,
        checkoutAt: updateVisitDto.checkoutAt ? new Date(updateVisitDto.checkoutAt) : undefined,
        plannedDate: updateVisitDto.plannedDate ? new Date(updateVisitDto.plannedDate) : undefined,
      },
      include: {
        outlet: true,
        orders: true,
        merchChecks: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    // Vérifier que la visite existe et appartient à l'utilisateur
    await this.findOne(id, userId);

    return this.prisma.visit.delete({
      where: { id },
    });
  }

  async checkin(id: string, userId: string, lat: number, lng: number) {
    const visit = await this.findOne(id, userId);

    return this.prisma.visit.update({
      where: { id },
      data: {
        status: VisitStatus.IN_PROGRESS,
        checkinAt: new Date(),
        checkinLat: lat,
        checkinLng: lng,
      },
    });
  }

  async checkout(id: string, userId: string, lat: number, lng: number) {
    const visit = await this.findOne(id, userId);

    const duration = visit.checkinAt
      ? Math.floor((new Date().getTime() - new Date(visit.checkinAt).getTime()) / 60000)
      : null;

    return this.prisma.visit.update({
      where: { id },
      data: {
        status: VisitStatus.COMPLETED,
        checkoutAt: new Date(),
        checkoutLat: lat,
        checkoutLng: lng,
        durationMin: duration,
      },
    });
  }

  async getVisitsByOutlet(outletId: string, userId: string) {
    // Vérifier que l'utilisateur est autorisé à voir les visites de cet outlet
    const visits = await this.prisma.visit.findMany({
      where: {
        outletId,
        userId, // Un utilisateur ne peut voir que ses propres visites
      },
      include: {
        outlet: true,
        orders: true,
        merchChecks: true,
      },
      orderBy: {
        plannedDate: 'desc',
      },
    });

    return visits;
  }

  async getTodaysVisits(userId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.prisma.visit.findMany({
      where: {
        userId,
        plannedDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        outlet: true,
      },
      orderBy: {
        plannedDate: 'asc',
      },
    });
  }
}
