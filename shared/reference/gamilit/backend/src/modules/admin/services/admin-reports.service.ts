import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/auth/entities/user.entity';
import { Tenant } from '@modules/auth/entities/tenant.entity';
import {
  ReportDto,
  GenerateReportDto,
  ListReportsDto,
  PaginatedReportsDto,
  ReportType,
  ReportFormat,
  ReportStatus,
} from '../dto/reports';

// Simple in-memory storage for reports (in production, use a database table)
const reportsStorage: Map<string, ReportDto> = new Map();

@Injectable()
export class AdminReportsService {
  constructor(
    @InjectRepository(User, 'auth')
    private readonly userRepo: Repository<User>,
    @InjectRepository(Tenant, 'auth')
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  /**
   * Generate a new report
   */
  async generateReport(
    generateDto: GenerateReportDto,
    userId: string,
  ): Promise<ReportDto> {
    // Create report record
    const reportId = this.generateUUID();
    const report: ReportDto = {
      id: reportId,
      type: generateDto.type,
      format: generateDto.format,
      status: ReportStatus.GENERATING,
      metadata: generateDto.filters,
      created_at: new Date().toISOString(),
      requested_by: userId,
    };

    // Store report
    reportsStorage.set(reportId, report);

    // Simulate report generation (in production, use a queue/background job)
    setTimeout(async () => {
      await this.completeReport(reportId);
    }, 2000); // Simulate 2 second generation time

    return report;
  }

  /**
   * Get list of reports
   */
  async getReports(query: ListReportsDto): Promise<PaginatedReportsDto> {
    const { type, status, page = 1, limit = 20 } = query;

    // Get all reports as array
    let reports = Array.from(reportsStorage.values());

    // Apply filters
    if (type) {
      reports = reports.filter((r) => r.type === type);
    }
    if (status) {
      reports = reports.filter((r) => r.status === status);
    }

    // Sort by created_at desc
    reports.sort((a, b) => b.created_at.localeCompare(a.created_at));

    // Pagination
    const total = reports.length;
    const skip = (page - 1) * limit;
    const data = reports.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Download a report
   */
  async downloadReport(reportId: string): Promise<ReportDto> {
    const report = reportsStorage.get(reportId);

    if (!report) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }

    if (report.status !== ReportStatus.COMPLETED) {
      throw new Error(`Report is not ready for download. Status: ${report.status}`);
    }

    return report;
  }

  /**
   * Delete a report
   */
  async deleteReport(reportId: string): Promise<void> {
    if (!reportsStorage.has(reportId)) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }

    reportsStorage.delete(reportId);
  }

  // =====================================================
  // PRIVATE HELPER METHODS
  // =====================================================

  /**
   * Complete report generation
   */
  private async completeReport(reportId: string): Promise<void> {
    const report = reportsStorage.get(reportId);
    if (!report) return;

    // Simulate file generation
    const fileName = `${report.type}-${new Date().toISOString().split('T')[0]}.${report.format}`;
    report.file_url = `/reports/${fileName}`;
    report.status = ReportStatus.COMPLETED;
    report.completed_at = new Date().toISOString();

    reportsStorage.set(reportId, report);
  }

  /**
   * Generate UUID (simple implementation)
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
