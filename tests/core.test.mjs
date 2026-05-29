import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../packages/core/src/index.ts", import.meta.url), "utf8");
assert.match(source, /export function scoreAssessment/);
assert.match(source, /humanReviewRequired: true/);
assert.match(source, /generateInterviewQuestions/);

const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
for (const model of ["Organization", "Candidate", "Employee", "Assessment", "InterviewSession", "AuditLog"]) {
  assert.match(schema, new RegExp(`model ${model}`));
}

console.log("PsycheHire core source and schema checks passed.");

