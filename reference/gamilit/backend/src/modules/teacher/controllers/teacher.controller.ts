/**
 * Teacher Controller
 *
 * Handles all teacher-related endpoints
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiProduces } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { GamilityRoleEnum } from '@/shared/constants/enums.constants';
import {
  TeacherDashboardService,
  StudentProgressService,
  GradingService,
  AnalyticsService,
  ReportsService,
} from '../services';
import {
  SubmitFeedbackDto,
  GetSubmissionsQueryDto,
  GetAnalyticsQueryDto,
  GetStudentProgressQueryDto,
  BulkGradeDto,
  AddTeacherNoteDto,
  StudentNoteResponseDto,
  GetEngagementMetricsDto,
  GenerateReportsDto,
  StudentInsightsResponseDto,
  ReportFormat,
} from '../dto';
import { GenerateReportDto } from '../dto/reports.dto';

@ApiTags('Teacher')
@ApiBearerAuth()
@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(GamilityRoleEnum.ADMIN_TEACHER, GamilityRoleEnum.SUPER_ADMIN)
export class TeacherController {
  constructor(
    private readonly dashboardService: TeacherDashboardService,
    private readonly studentProgressService: StudentProgressService,
    private readonly gradingService: GradingService,
    private readonly analyticsService: AnalyticsService,
    private readonly reportsService: ReportsService,
  ) {}

  // =====================================================
  // DASHBOARD ENDPOINTS
  // =====================================================

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get classroom statistics' })
  async getClassroomStats(@Request() req: any) {
    const teacherId = req.user.id;
    return this.dashboardService.getClassroomStats(teacherId);
  }

  @Get('dashboard/activities')
  @ApiOperation({ summary: 'Get recent activities' })
  async getRecentActivities(@Request() req: any, @Query('limit') limit?: number) {
    const teacherId = req.user.id;
    return this.dashboardService.getRecentActivities(
      teacherId,
      limit ? parseInt(limit as any) : 10,
    );
  }

  @Get('dashboard/alerts')
  @ApiOperation({ summary: 'Get student alerts' })
  async getStudentAlerts(@Request() req: any) {
    const teacherId = req.user.id;
    return this.dashboardService.getStudentAlerts(teacherId);
  }

  @Get('dashboard/top-performers')
  @ApiOperation({ summary: 'Get top performing students' })
  async getTopPerformers(@Request() req: any, @Query('limit') limit?: number) {
    const teacherId = req.user.id;
    return this.dashboardService.getTopPerformers(
      teacherId,
      limit ? parseInt(limit as any) : 5,
    );
  }

  @Get('dashboard/module-progress')
  @ApiOperation({ summary: 'Get module progress summary' })
  async getModuleProgressSummary(@Request() req: any) {
    const teacherId = req.user.id;
    return this.dashboardService.getModuleProgressSummary(teacherId);
  }

  // =====================================================
  // STUDENT PROGRESS ENDPOINTS
  // =====================================================

  @Get('students/:studentId/progress')
  @ApiOperation({ summary: 'Get complete student progress' })
  async getStudentProgress(
    @Param('studentId') studentId: string,
    @Query() query: GetStudentProgressQueryDto,
  ) {
    return this.studentProgressService.getStudentProgress(studentId, query);
  }

  @Get('students/:studentId/overview')
  @ApiOperation({ summary: 'Get student overview' })
  async getStudentOverview(@Param('studentId') studentId: string) {
    return this.studentProgressService.getStudentOverview(studentId);
  }

  @Get('students/:studentId/stats')
  @ApiOperation({ summary: 'Get student statistics' })
  async getStudentStats(@Param('studentId') studentId: string) {
    return this.studentProgressService.getStudentStats(studentId);
  }

  @Get('students/:studentId/notes')
  @ApiOperation({
    summary: 'Get teacher notes for a student',
    description: 'Retrieve teacher notes for a specific student across all classrooms',
  })
  async getStudentNotes(
    @Param('studentId') studentId: string,
    @Request() req: any,
  ): Promise<StudentNoteResponseDto[]> {
    const teacherId = req.user.profile.id;
    return this.studentProgressService.getStudentNotes(studentId, teacherId);
  }

  @Post('students/:studentId/note')
  @ApiOperation({
    summary: 'Add or update teacher note for a student',
    description: 'Add or update a note about a student in a specific classroom',
  })
  async addStudentNote(
    @Param('studentId') studentId: string,
    @Body() noteDto: AddTeacherNoteDto,
    @Request() req: any,
  ): Promise<StudentNoteResponseDto> {
    const teacherId = req.user.profile.id;
    return this.studentProgressService.addStudentNote(
      studentId,
      teacherId,
      noteDto,
    );
  }

  @Get('students/:studentId/insights')
  @ApiOperation({
    summary: 'Get comprehensive student insights',
    description: 'Get AI-powered insights including strengths, weaknesses, predictions, and personalized recommendations for a student',
  })
  async getStudentInsights(@Param('studentId') studentId: string) {
    return this.analyticsService.getStudentInsights(studentId);
  }

  // =====================================================
  // GRADING ENDPOINTS
  // =====================================================

  @Get('submissions')
  @ApiOperation({ summary: 'Get submissions with filters' })
  async getSubmissions(@Query() query: GetSubmissionsQueryDto) {
    return this.gradingService.getSubmissions(query);
  }

  @Get('submissions/:id')
  @ApiOperation({
    summary: 'Get submission details by ID',
    description: 'Retrieve detailed information about a specific exercise submission',
  })
  async getSubmissionById(@Param('id') id: string) {
    return this.gradingService.getSubmissionById(id);
  }

  @Post('submissions/:submissionId/feedback')
  @ApiOperation({ summary: 'Submit feedback for a submission' })
  async submitFeedback(
    @Param('submissionId') submissionId: string,
    @Body() feedbackDto: SubmitFeedbackDto,
  ) {
    return this.gradingService.submitFeedback(submissionId, feedbackDto);
  }

  @Post('submissions/bulk-grade')
  @ApiOperation({ summary: 'Grade multiple submissions at once' })
  async bulkGrade(@Body() bulkDto: BulkGradeDto) {
    return this.gradingService.bulkGrade(bulkDto);
  }

  // =====================================================
  // ANALYTICS ENDPOINTS
  // =====================================================

  @Get('analytics')
  @ApiOperation({ summary: 'Get classroom analytics' })
  async getClassroomAnalytics(@Query() query: GetAnalyticsQueryDto) {
    return this.analyticsService.getClassroomAnalytics(query);
  }

  @Get('analytics/classroom/:id')
  @ApiOperation({
    summary: 'Get analytics for a specific classroom',
    description:
      'Retrieve detailed analytics for a specific classroom including student performance, completion rates, and score distribution',
  })
  async getClassroomAnalyticsByClassroomId(
    @Param('id') classroomId: string,
    @Query() query: GetAnalyticsQueryDto,
  ) {
    return this.analyticsService.getClassroomAnalyticsByClassroomId(
      classroomId,
      query,
    );
  }

  @Get('analytics/assignment/:id')
  @ApiOperation({
    summary: 'Get analytics for a specific assignment',
    description:
      'Retrieve analytics for a specific assignment including submission rates, grading status, and score distribution',
  })
  async getAssignmentAnalytics(@Param('id') assignmentId: string) {
    return this.analyticsService.getAssignmentAnalytics(assignmentId);
  }

  @Get('analytics/engagement')
  @ApiOperation({
    summary: 'Get engagement metrics',
    description:
      'Retrieve engagement metrics including active students, submission rates, and classroom activity',
  })
  async getEngagementMetrics(
    @Request() req: any,
    @Query() query: GetEngagementMetricsDto,
  ) {
    const teacherId = req.user.profile.id;
    return this.analyticsService.getEngagementMetrics(teacherId, query);
  }

  @Get('analytics/reports')
  @ApiOperation({
    summary: 'Generate comprehensive reports',
    description:
      'Generate comprehensive reports with analytics across classrooms, assignments, and student performance',
  })
  async generateReports(
    @Request() req: any,
    @Query() query: GenerateReportsDto,
  ) {
    const teacherId = req.user.profile.id;
    return this.analyticsService.generateReports(teacherId, query);
  }

  // =====================================================
  // REPORT GENERATION ENDPOINTS (PDF/Excel with Insights)
  // =====================================================

  @Post('reports/generate')
  @ApiOperation({
    summary: 'Generate student insights report',
    description:
      'Generate a comprehensive report with student insights in PDF or Excel format. ' +
      'Reports include risk analysis, recommendations, strengths/weaknesses, and predictions.',
  })
  @ApiProduces('application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async generateInsightsReport(
    @Request() req: any,
    @Body() dto: GenerateReportDto,
    @Res() res: Response,
  ) {
    const userId = req.user.profile.id;

    // Generate report
    const { buffer, metadata } = await this.reportsService.generateReport(dto, userId);

    // Set appropriate headers
    const filename = `student-insights-${metadata.report_id}.${dto.format === ReportFormat.PDF ? 'pdf' : 'xlsx'}`;
    const contentType =
      dto.format === ReportFormat.PDF
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
      'X-Report-ID': metadata.report_id,
      'X-Student-Count': metadata.student_count,
      'X-Generated-At': metadata.generated_at.toISOString(),
    });

    res.status(HttpStatus.OK).send(buffer);
  }
}
