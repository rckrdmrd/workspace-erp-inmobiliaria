import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminReportsService } from '../services/admin-reports.service';
import {
  ReportDto,
  GenerateReportDto,
  ListReportsDto,
  PaginatedReportsDto,
} from '../dto/reports';

@ApiTags('Admin - Reports')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a new report',
    description:
      'Generate a new report of specified type and format. Report generation is asynchronous.',
  })
  async generateReport(
    @Body() generateDto: GenerateReportDto,
    @Request() req: any,
  ): Promise<ReportDto> {
    const userId = req.user?.id || req.user?.sub;
    return await this.adminReportsService.generateReport(generateDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'List all reports',
    description:
      'Retrieve a paginated list of reports with optional filters',
  })
  async getReports(@Query() query: ListReportsDto): Promise<PaginatedReportsDto> {
    return await this.adminReportsService.getReports(query);
  }

  @Get(':id/download')
  @ApiOperation({
    summary: 'Download a report',
    description:
      'Download a completed report. Returns error if report is not ready.',
  })
  async downloadReport(@Param('id') id: string): Promise<ReportDto> {
    return await this.adminReportsService.downloadReport(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a report',
    description: 'Delete a report and its associated file',
  })
  async deleteReport(@Param('id') id: string): Promise<void> {
    await this.adminReportsService.deleteReport(id);
  }
}
