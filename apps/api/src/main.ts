import "reflect-metadata";
import { randomUUID } from "node:crypto";
import { Module, Injectable, Controller, Get, Post, Body, Param, UseGuards, Req } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ApiBearerAuth, ApiTags, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PrismaClient, UserRole } from "@prisma/client";
import { assessmentQuestions, compositeTalentScore, generateInterviewQuestions, scoreAssessment } from "@psychehire/core";
import * as jwt from "jsonwebtoken";

@Injectable()
class PrismaService extends PrismaClient {}

@Injectable()
class AuditService {
  constructor(private prisma: PrismaService) {}
  async log(organizationId: string, actorUserId: string | null, action: string, resourceType: string, resourceId: string, metadata = {}) {
    await this.prisma.auditLog.create({ data: { organizationId, actorUserId, action, resourceType, resourceId, metadata } });
  }
}

@Injectable()
class RbacGuard {
  canActivate(context: any) {
    const req = context.switchToHttp().getRequest();
    const role = req.headers["x-demo-role"] || UserRole.HR_ADMIN;
    req.user = { id: req.headers["x-demo-user"] || "demo-user", role, organizationId: req.headers["x-org-id"] || "demo-org" };
    return true;
  }
}

@ApiTags("auth")
@Controller("auth")
class AuthController {
  @Post("login")
  login(@Body() body: { email: string; password: string; organizationSlug: string }) {
    return {
      accessToken: jwt.sign({ sub: body.email, role: "HR_ADMIN", org: body.organizationSlug }, process.env.JWT_SECRET || "dev-only-change-me", { expiresIn: "8h" }),
      user: { email: body.email, role: "HR_ADMIN", organizationSlug: body.organizationSlug }
    };
  }
}

@ApiBearerAuth()
@ApiTags("assessments")
@UseGuards(RbacGuard)
@Controller("assessments")
class AssessmentController {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  @Get("questions")
  questions() {
    return assessmentQuestions;
  }

  @Post("invite")
  async invite(@Req() req: any, @Body() body: { candidateId?: string; employeeId?: string; expiresAt?: string }) {
    const token = randomUUID();
    const assessment = await this.prisma.assessment.create({
      data: {
        organizationId: req.user.organizationId,
        candidateId: body.candidateId,
        employeeId: body.employeeId,
        secureToken: token,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(Date.now() + 7 * 86400000)
      }
    });
    await this.audit.log(req.user.organizationId, req.user.id, "ASSESSMENT_INVITED", "Assessment", assessment.id, { candidateId: body.candidateId, employeeId: body.employeeId });
    return { id: assessment.id, url: `/assessment/open/${token}`, token };
  }

  @Post(":id/submit")
  async submit(@Req() req: any, @Param("id") id: string, @Body() body: { responses: any[]; signals: any }) {
    const profile = scoreAssessment(body.responses, body.signals);
    await this.prisma.assessment.update({ where: { id }, data: { status: "SCORED", submittedAt: new Date() } }).catch(() => null);
    const score = await this.prisma.score
      .create({
        data: {
          assessmentId: id,
          traitScores: profile.traitScores,
          roleFit: profile.roleAlignment,
          riskScores: {
            burnoutLikelihood: profile.burnoutLikelihood,
            integrityAdvisory: profile.integrityAdvisory,
            retentionRisk: profile.retentionRisk
          },
          recommendations: {
            trainingNeeds: profile.trainingNeeds,
            advisoryFlags: profile.advisoryFlags,
            recommendedAction: profile.recommendedAction
          },
          humanReviewRequired: true
        }
      })
      .catch(() => null);
    await this.audit.log(req.user.organizationId, req.user.id, "ASSESSMENT_SCORED", "Assessment", id, { humanReviewRequired: true });
    return { profile, scoreId: score?.id };
  }
}

@ApiBearerAuth()
@ApiTags("interviews")
@UseGuards(RbacGuard)
@Controller("interviews")
class InterviewController {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  @Post("session")
  async createSession(@Req() req: any, @Body() body: { candidateId?: string; employeeId?: string; role: string; profile?: any }) {
    const token = randomUUID();
    const questions = body.profile ? generateInterviewQuestions(body.role, body.profile) : [`Why are you interested in this ${body.role} role?`];
    const session = await this.prisma.interviewSession.create({
      data: {
        organizationId: req.user.organizationId,
        candidateId: body.candidateId,
        employeeId: body.employeeId,
        secureToken: token,
        questions,
        expiresAt: new Date(Date.now() + 72 * 3600000)
      }
    });
    await this.audit.log(req.user.organizationId, req.user.id, "INTERVIEW_SESSION_CREATED", "InterviewSession", session.id, {});
    return { id: session.id, token, url: `/interview/session/${token}`, questions };
  }

  @Post(":id/analysis")
  async attachAnalysis(@Req() req: any, @Param("id") id: string, @Body() body: { transcript: string; facial: any; voice: any; content: any; behavioralScores: Record<string, number>; profile?: any }) {
    const composite = body.profile ? compositeTalentScore(body.profile, body.behavioralScores) : null;
    const analysis = await this.prisma.interviewAnalysis.create({
      data: {
        sessionId: id,
        facialSummary: body.facial,
        voiceSummary: body.voice,
        contentSummary: body.content,
        behavioralScores: { ...body.behavioralScores, compositeTalentScore: composite },
        flaggedSegments: body.content?.flaggedSegments || [],
        advisorySummary: "Advisory signal only. A qualified human reviewer must document the final decision."
      }
    });
    await this.audit.log(req.user.organizationId, req.user.id, "INTERVIEW_ANALYSIS_ATTACHED", "InterviewSession", id, { composite });
    return analysis;
  }
}

@ApiBearerAuth()
@ApiTags("workforce")
@UseGuards(RbacGuard)
@Controller("workforce")
class WorkforceController {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  @Post("signals")
  async ingestSignal(@Req() req: any, @Body() body: { employeeId: string; source: string; policyMode: string; metrics: any }) {
    const signal = await this.prisma.workforceSignal.create({ data: { employeeId: body.employeeId, source: body.source, policyMode: body.policyMode, metrics: body.metrics } });
    await this.audit.log(req.user.organizationId, req.user.id, "WORKFORCE_SIGNAL_INGESTED", "WorkforceSignal", signal.id, { policyMode: body.policyMode, source: body.source });
    return signal;
  }

  @Get("analytics/:employeeId")
  async analytics(@Param("employeeId") employeeId: string) {
    const signals = await this.prisma.workforceSignal.findMany({ where: { employeeId }, take: 50, orderBy: { observedAt: "desc" } });
    const pressure = signals.reduce((sum, s: any) => sum + Number(s.metrics?.workloadPressure || 0), 0) / Math.max(signals.length, 1);
    const engagement = signals.reduce((sum, s: any) => sum + Number(s.metrics?.engagement || 50), 0) / Math.max(signals.length, 1);
    return {
      retentionRisk: Math.round(Math.min(100, pressure * 0.55 + (100 - engagement) * 0.45)),
      burnoutIndex: Math.round(Math.min(100, pressure * 0.7 + Math.max(0, 50 - engagement) * 0.3)),
      promotionReadiness: Math.round(Math.max(0, engagement * 0.65 + (100 - pressure) * 0.35)),
      advisoryOnly: true,
      humanReviewRequired: true
    };
  }
}

@Module({
  controllers: [AuthController, AssessmentController, InterviewController, WorkforceController],
  providers: [PrismaService, AuditService, RbacGuard]
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder().setTitle("PsycheHire AI API").setVersion("1.0").addBearerAuth().build();
  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
