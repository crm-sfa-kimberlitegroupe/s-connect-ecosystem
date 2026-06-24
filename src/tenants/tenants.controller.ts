import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private prisma: PrismaService) {}

  @Get('public/list')
  @ApiOperation({ summary: 'List active tenants (public - no auth required)' })
  async listTenants() {
    const tenants = await this.prisma.tenant.findMany({
      where: { isActive: true },
      select: {
        id: true,
        companyName: true,
        industry: true,
      },
      orderBy: { companyName: 'asc' },
    });

    return { success: true, tenants };
  }
}
