import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('visits')
@UseGuards(JwtAuthGuard)
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  create(@Request() req, @Body() createVisitDto: CreateVisitDto) {
    return this.visitsService.create(req.user.id, createVisitDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.visitsService.findAll(req.user.id);
  }

  @Get('today')
  getTodaysVisits(@Request() req) {
    return this.visitsService.getTodaysVisits(req.user.id);
  }

  @Get('outlet/:outletId')
  getVisitsByOutlet(@Request() req, @Param('outletId') outletId: string) {
    return this.visitsService.getVisitsByOutlet(outletId, req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.visitsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ) {
    return this.visitsService.update(id, req.user.id, updateVisitDto);
  }

  @Patch(':id/checkin')
  checkin(
    @Request() req,
    @Param('id') id: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return this.visitsService.checkin(id, req.user.id, lat, lng);
  }

  @Patch(':id/checkout')
  checkout(
    @Request() req,
    @Param('id') id: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return this.visitsService.checkout(id, req.user.id, lat, lng);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.visitsService.remove(id, req.user.id);
  }
}
