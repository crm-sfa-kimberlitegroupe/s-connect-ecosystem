import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TerritoriesService } from './territories.service';

@ApiTags('Territories')
@Controller('territories')
export class TerritoriesController {
  constructor(private territoriesService: TerritoriesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all territories' })
  async findAll(@Query('level') level?: string, @Query('parentId') parentId?: string) {
    const territories = await this.territoriesService.findAll({ level, parentId });
    return {
      success: true,
      data: territories,
      message: 'Territories retrieved successfully',
    };
  }

  @Get('sectors')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sectors' })
  async getAllSectors(@Query('level') level?: string) {
    const sectors = await this.territoriesService.findAllSectors({ level });
    return {
      success: true,
      data: sectors,
      message: 'Sectors retrieved successfully',
    };
  }

  @Get('sectors/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sector by ID' })
  async getSectorById(@Param('id') id: string) {
    const sector = await this.territoriesService.getSectorById(id);
    return {
      success: true,
      data: sector,
      message: 'Sector retrieved successfully',
    };
  }

  @Post('sectors')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new sector' })
  async createSector(@Body() data: any) {
    const sector = await this.territoriesService.createSector(data);
    return {
      success: true,
      data: sector,
      message: 'Sector created successfully',
    };
  }

  @Post('sectors/assign-outlets')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign outlets to sector' })
  async assignOutletsToSector(@Body() data: { sectorId: string; outletIds: string[] }) {
    const result = await this.territoriesService.assignOutletsToSector(data);
    return {
      success: true,
      data: result,
      message: 'Outlets assigned to sector successfully',
    };
  }

  @Post('sectors/assign-vendor')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign sector to vendor' })
  async assignSectorToVendor(@Body() data: { vendorId: string; sectorId: string }) {
    const user = await this.territoriesService.assignSectorToVendor(data);
    return {
      success: true,
      data: user,
      message: 'Sector assigned to vendor successfully',
    };
  }

  @Get('vendors/:vendorId/outlets')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor outlets' })
  async getVendorOutlets(@Param('vendorId') vendorId: string) {
    const result = await this.territoriesService.getVendorOutlets(vendorId);
    return {
      success: true,
      data: result,
      message: 'Vendor outlets retrieved successfully',
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get territory by ID' })
  async findById(@Param('id') id: string) {
    const territory = await this.territoriesService.findById(id);
    return {
      success: true,
      data: territory,
      message: 'Territory retrieved successfully',
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new territory' })
  async create(@Body() data: any) {
    const territory = await this.territoriesService.create(data);
    return {
      success: true,
      data: territory,
      message: 'Territory created successfully',
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update territory' })
  async update(@Param('id') id: string, @Body() data: any) {
    const territory = await this.territoriesService.update(id, data);
    return {
      success: true,
      data: territory,
      message: 'Territory updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete territory' })
  async delete(@Param('id') id: string) {
    await this.territoriesService.delete(id);
    return {
      success: true,
      message: 'Territory deleted successfully',
    };
  }

  @Get('users/managers/list')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all managers' })
  async getManagers() {
    const managers = await this.territoriesService.getManagers();
    return {
      success: true,
      data: managers,
      message: 'Managers retrieved successfully',
    };
  }

  @Get('admins/available')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available admins' })
  async getAvailableAdmins(@Query('excludeTerritoryId') excludeTerritoryId?: string) {
    const admins = await this.territoriesService.getAvailableAdmins(excludeTerritoryId);
    return {
      success: true,
      data: admins,
      message: 'Available admins retrieved successfully',
    };
  }

  @Patch(':id/assign-admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign admin to territory' })
  async assignAdmin(@Param('id') territoryId: string, @Body('adminId') adminId: string) {
    const territory = await this.territoriesService.assignAdmin(territoryId, adminId);
    return {
      success: true,
      data: territory,
      message: 'Admin assigned successfully',
    };
  }

  @Patch(':id/reassign-admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reassign admin to territory' })
  async reassignAdmin(@Param('id') territoryId: string, @Body('adminId') adminId: string) {
    const territory = await this.territoriesService.reassignAdmin(territoryId, adminId);
    return {
      success: true,
      data: territory,
      message: 'Admin reassigned successfully',
    };
  }

  @Delete(':id/remove-admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove admin from territory' })
  async removeAdmin(@Param('id') territoryId: string) {
    const territory = await this.territoriesService.removeAdmin(territoryId);
    return {
      success: true,
      data: territory,
      message: 'Admin removed successfully',
    };
  }

  @Patch('sectors/:id/reassign-vendor')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reassign vendor to sector' })
  async reassignSectorVendor(@Param('id') sectorId: string, @Body('vendorId') vendorId: string) {
    const territory = await this.territoriesService.reassignSectorVendor(sectorId, vendorId);
    return {
      success: true,
      data: territory,
      message: 'Vendor reassigned successfully',
    };
  }

  @Delete('sectors/:id/unassign-vendor')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unassign vendor from sector' })
  async unassignSectorVendor(@Param('id') sectorId: string) {
    const territory = await this.territoriesService.unassignSectorVendor(sectorId);
    return {
      success: true,
      data: territory,
      message: 'Vendor unassigned successfully',
    };
  }

  @Get('vendors/with-sectors')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all vendors with sectors' })
  async getAllVendorsWithSectors() {
    const vendors = await this.territoriesService.getAllVendorsWithSectors();
    return {
      success: true,
      data: vendors,
      message: 'Vendors with sectors retrieved successfully',
    };
  }

  @Get(':id/geo-info')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get territory geographic info' })
  async getTerritoryGeoInfo(@Param('id') territoryId: string) {
    const geoInfo = await this.territoriesService.getTerritoryGeoInfo(territoryId);
    return {
      success: true,
      data: geoInfo,
      message: 'Geographic info retrieved successfully',
    };
  }

  @Post('sectors/remove-outlets')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove outlets from sector' })
  async removeOutletsFromSector(@Body() data: { sectorId: string; outletIds: string[] }) {
    const result = await this.territoriesService.removeOutletsFromSector(data);
    return {
      success: true,
      data: result,
      message: 'Outlets removed successfully',
    };
  }

  @Post('vendors/assign-outlets')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign outlets to vendor' })
  async assignOutletsToVendor(@Body() data: { vendorId: string; outletIds: string[] }) {
    const result = await this.territoriesService.assignOutletsToVendor(data);
    return {
      success: true,
      data: result,
      message: 'Outlets assigned to vendor successfully',
    };
  }

  @Delete('vendors/:vendorId/sector')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove sector from vendor' })
  async removeSectorFromVendor(@Param('vendorId') vendorId: string) {
    const result = await this.territoriesService.removeSectorFromVendor(vendorId);
    return {
      success: true,
      data: result,
      message: 'Sector removed from vendor successfully',
    };
  }

  @Get('vendors/:vendorId/assigned-sector')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor assigned sector' })
  async getVendorAssignedSector(@Param('vendorId') vendorId: string) {
    const sector = await this.territoriesService.getVendorAssignedSector(vendorId);
    return sector;
  }
}