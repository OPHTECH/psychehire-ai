import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: "verdant-works" },
    update: {},
    create: {
      name: "Verdant Works",
      slug: "verdant-works",
      region: "NG",
      privacyPolicy: { workforceAnalytics: "opt-in", contentAnalysis: "explicit-consent", automatedDecisions: false },
      featureToggles: { videoInterview: true, workforceSignals: true, contentAnalysis: false },
      branding: { primary: "#245343", accent: "#86a58f" }
    }
  });

  const admin = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email: "hr@verdant.example" } },
    update: {},
    create: {
      organizationId: org.id,
      email: "hr@verdant.example",
      name: "Amara Okeke",
      role: UserRole.HR_ADMIN,
      permissions: ["assessments:create", "reports:view", "workforce:view"],
      passwordHash: await bcrypt.hash("PsycheHireDemo!2026", 10)
    }
  });

  const ops = await prisma.department.create({ data: { organizationId: org.id, name: "Operations", managerId: admin.id } });
  const role = await prisma.jobRole.create({
    data: {
      organizationId: org.id,
      departmentId: ops.id,
      title: "Operations Lead",
      family: "Operations",
      psychWeights: { conscientiousness: 1.4, pressureHandling: 1.2, accountability: 1.2 },
      competencies: ["Process discipline", "Team leadership", "Incident response"]
    }
  });

  await prisma.candidate.create({
    data: {
      organizationId: org.id,
      roleId: role.id,
      fullName: "Tari Adeyemi",
      email: "tari@example.com",
      phone: "+2348010000000",
      biodata: { location: "Lagos", qualification: "BSc Psychology", expectedSalary: "NGN 850,000" }
    }
  });

  await prisma.employee.create({
    data: {
      organizationId: org.id,
      departmentId: ops.id,
      roleId: role.id,
      fullName: "Kemi Balogun",
      email: "kemi@verdant.example",
      tenureMonths: 28,
      employmentData: { level: "Senior Associate", trainingHistory: ["Lean operations", "Manager essentials"] }
    }
  });
}

main().finally(() => prisma.$disconnect());

