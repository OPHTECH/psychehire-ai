# PsycheHire AI

Enterprise psychological profiling, behavioral interview, and workforce intelligence platform for SME and corporate HR teams.

## What is included

- Next.js + TypeScript frontend with landing page, login/register, HR dashboard, candidate portal, employee reassessment, report viewer, comparison, analytics, organization setup, role management, profile, and settings.
- NestJS API with JWT-ready auth, RBAC guard structure, assessment invites/submission, scoring, interview sessions, workforce signal ingestion, Swagger docs, consent/audit patterns, and Prisma access.
- PostgreSQL Prisma schema for organizations, users, candidates, employees, departments, roles, assessments, responses, scores, interviews, reports, workforce signals, surveys, consent, and audit logs.
- Shared TypeScript scoring package with psychometric scoring, role fit, advisory risk indicators, interview question generation, and composite talent scoring.
- FastAPI Behavioral Intelligence Interview Engine with actual transcript, video-frame, and audio acoustic analysis endpoints using OpenCV/librosa-compatible pipelines.
- Docker Compose, Kubernetes starter manifests, environment template, seed data, tests, and sample psych report.

## Safety and governance

The platform intentionally treats psychometric, video, voice, deception, retention, and workplace-risk outputs as advisory indicators. It does not make final hiring, promotion, disciplinary, or termination decisions. All sensitive recommendations require documented human review and are audit logged.

## Local setup

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Run the API:

```bash
npm run dev:api
```

Run the ML service:

```bash
cd apps/ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Run all services with Docker:

```bash
docker compose up --build
```

## URLs

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- API docs: `http://localhost:4000/api/docs`
- ML service: `http://localhost:8000/docs`

## Demo credentials

- Email: `hr@verdant.example`
- Password: `PsycheHireDemo!2026`

