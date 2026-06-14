import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Query('role') role?: string, @Query('territoryId') territoryId?: string) {
    const users = await this.usersService.findAll({ role: role as any, territoryId });
    return {
      success: true,
      data: users,
      message: 'Users retrieved successfully',
    };
  }

  @Get('team/all')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get team members' })
  async getTeamMembers(@Request() req) {
    const users = await this.usersService.getTeamMembers(req.user.id);
    return {
      success: true,
      data: users,
      message: 'Team members retrieved successfully',
    };
  }

  @Get('managers/list')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all managers' })
  async getManagers() {
    const users = await this.usersService.findAll({ role: 'SUP' as any });
    return {
      success: true,
      data: users,
      message: 'Managers retrieved successfully',
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return {
      success: true,
      data: user,
      message: 'User retrieved successfully',
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() userData: any) {
    const user = await this.usersService.create(userData);
    return {
      success: true,
      data: user,
      message: 'User created successfully',
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() userData: any) {
    const user = await this.usersService.update(id, userData);
    return {
      success: true,
      data: user,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  @Patch(':id/toggle-status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle user status' })
  async toggleStatus(@Param('id') id: string) {
    const user = await this.usersService.toggleStatus(id);
    return {
      success: true,
      data: user,
      message: 'User status toggled successfully',
    };
  }

  @Get(':id/performance')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user performance' })
  async getPerformance(@Param('id') id: string) {
    const performance = await this.usersService.getPerformance(id);
    return {
      success: true,
      data: performance,
      message: 'Performance retrieved successfully',
    };
  }

  @Post(':id/upload-photo')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload user photo' })
  async uploadPhoto(@Param('id') id: string, @Body('photoUrl') photoUrl: string) {
    const user = await this.usersService.uploadPhoto(id, photoUrl);
    return {
      success: true,
      data: { photoUrl: user.photoUrl },
      message: 'Photo uploaded successfully',
    };
  }

  @Get(':id/manager')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user manager' })
  async getManager(@Param('id') id: string) {
    const manager = await this.usersService.getManager(id);
    return {
      success: true,
      data: manager,
      message: 'Manager retrieved successfully',
    };
  }
}