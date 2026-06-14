import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OutletsService } from './outlets.service';

@ApiTags('Outlets')
@Controller('outlets')
export class OutletsController {
  constructor(private outletsService: OutletsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all outlets' })
  async findAll(
    @Query('status') status?: string,
    @Query('territoryId') territoryId?: string,
    @Query('channel') channel?: string,
    @Query('proposedBy') proposedBy?: string,
  ) {
    const outlets = await this.outletsService.findAll({
      status,
      territoryId,
      channel,
      proposedBy,
    });
    return outlets;
  }

  @Get('my-territory')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get outlets from my territory' })
  async getMyTerritoryOutlets(
    @Query('status') status?: string,
    @Query('channel') channel?: string,
  ) {
    const outlets = await this.outletsService.getMyTerritoryOutlets({ status, channel });
    return outlets;
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get outlets statistics' })
  async getStats(
    @Query('territoryId') territoryId?: string,
    @Query('proposedBy') proposedBy?: string,
  ) {
    const stats = await this.outletsService.getStats({ territoryId, proposedBy });
    return stats;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get outlet by ID' })
  async findById(@Param('id') id: string) {
    const outlet = await this.outletsService.findById(id);
    return outlet;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new outlet' })
  async create(@Body() data: any) {
    const outlet = await this.outletsService.create(data);
    return outlet;
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update outlet' })
  async update(@Param('id') id: string, @Body() data: any) {
    const outlet = await this.outletsService.update(id, data);
    return outlet;
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve outlet' })
  async approve(@Param('id') id: string) {
    const outlet = await this.outletsService.approve(id);
    return outlet;
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject outlet' })
  async reject(@Param('id') id: string, @Body('reason') reason?: string) {
    const outlet = await this.outletsService.reject(id, reason);
    return outlet;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete outlet' })
  async delete(@Param('id') id: string) {
    await this.outletsService.delete(id);
    return {
      success: true,
      message: 'Outlet deleted successfully',
    };
  }
}