export type AssessmentDomain =
  | "ocean"
  | "mbti"
  | "disc"
  | "cognitive"
  | "emotionalIntelligence"
  | "integrity"
  | "stress"
  | "leadership";

export type Question = {
  id: string;
  domain: AssessmentDomain;
  trait: string;
  prompt: string;
  reverse?: boolean;
  weight: number;
};

export type ResponseInput = {
  questionId: string;
  value: number;
  elapsedMs?: number;
  skipped?: boolean;
  confidence?: number;
};

export type BehavioralSignals = {
  hesitationRate: number;
  contradictionRate: number;
  skippedRate: number;
  confidenceMean: number;
  transcriptSentiment?: number;
  speechPausesPerMinute?: number;
  pitchVariance?: number;
  gazeStability?: number;
  movementIntensity?: number;
};

export type ScoreProfile = {
  traitScores: Record<string, number>;
  psychProfileScore: number;
  roleAlignment: Record<string, number>;
  leadershipReadiness: number;
  burnoutLikelihood: number;
  integrityAdvisory: number;
  retentionRisk: number;
  trainingNeeds: string[];
  advisoryFlags: string[];
  recommendedAction: string;
  humanReviewRequired: true;
};

export const assessmentQuestions: Question[] = [
  { id: "ocean-o-1", domain: "ocean", trait: "openness", prompt: "I enjoy solving problems that require new approaches.", weight: 1 },
  { id: "ocean-c-1", domain: "ocean", trait: "conscientiousness", prompt: "I keep careful track of commitments and deadlines.", weight: 1.2 },
  { id: "ocean-e-1", domain: "ocean", trait: "extraversion", prompt: "I gain energy from frequent collaboration.", weight: 0.8 },
  { id: "ocean-a-1", domain: "ocean", trait: "agreeableness", prompt: "I try to understand a colleague's pressure before reacting.", weight: 1 },
  { id: "ocean-n-1", domain: "ocean", trait: "emotionalStability", prompt: "I stay composed when plans change suddenly.", weight: 1.2 },
  { id: "mbti-ie-1", domain: "mbti", trait: "introversionExtroversion", prompt: "I prefer to think aloud with a team when solving ambiguous work problems.", weight: 0.7 },
  { id: "disc-d-1", domain: "disc", trait: "dominance", prompt: "I am comfortable making decisions when information is incomplete.", weight: 0.9 },
  { id: "disc-s-1", domain: "disc", trait: "steadiness", prompt: "I remain consistent through repetitive or high-volume work.", weight: 0.9 },
  { id: "cog-l-1", domain: "cognitive", trait: "logic", prompt: "When two metrics disagree, I look for the assumption connecting them.", weight: 1.2 },
  { id: "cog-v-1", domain: "cognitive", trait: "verbalReasoning", prompt: "I can quickly summarize complex information for different audiences.", weight: 1 },
  { id: "ei-e-1", domain: "emotionalIntelligence", trait: "empathy", prompt: "I notice when team members are withdrawing before they say something.", weight: 1 },
  { id: "ei-r-1", domain: "emotionalIntelligence", trait: "resilience", prompt: "I recover quickly after critical feedback.", weight: 1.1 },
  { id: "int-h-1", domain: "integrity", trait: "honesty", prompt: "I escalate mistakes even when they could reflect poorly on me.", weight: 1.4 },
  { id: "int-a-1", domain: "integrity", trait: "accountability", prompt: "I document decisions that affect customers, money, or safety.", weight: 1.2 },
  { id: "stress-p-1", domain: "stress", trait: "pressureHandling", prompt: "Under pressure, I prioritize clearly instead of reacting to everything at once.", weight: 1.2 },
  { id: "lead-i-1", domain: "leadership", trait: "initiative", prompt: "I take ownership of unclear problems before being asked.", weight: 1.2 },
  { id: "lead-s-1", domain: "leadership", trait: "strategicThinking", prompt: "I connect daily decisions to the wider business model.", weight: 1.1 },
  { id: "lead-m-1", domain: "leadership", trait: "mentoring", prompt: "I deliberately help colleagues grow beyond the current task.", weight: 1 }
];

export const roleWeights: Record<string, Record<string, number>> = {
  "Software Engineer": { logic: 1.4, conscientiousness: 1.2, openness: 1.1, pressureHandling: 0.9 },
  Sales: { extraversion: 1.3, empathy: 1.1, resilience: 1.2, dominance: 0.8 },
  Operations: { conscientiousness: 1.4, steadiness: 1.2, accountability: 1.2, pressureHandling: 1 },
  HR: { empathy: 1.4, agreeableness: 1.1, verbalReasoning: 1, honesty: 1.2 },
  Finance: { conscientiousness: 1.4, honesty: 1.4, logic: 1.1, steadiness: 0.9 },
  Management: { strategicThinking: 1.3, initiative: 1.2, mentoring: 1, emotionalStability: 1.1 },
  Product: { openness: 1.3, verbalReasoning: 1.1, strategicThinking: 1.2, empathy: 1 },
  "Customer Service": { empathy: 1.4, emotionalStability: 1.2, agreeableness: 1.1, resilience: 1 },
  Logistics: { steadiness: 1.3, pressureHandling: 1.2, conscientiousness: 1.1, accountability: 1 },
  Leadership: { strategicThinking: 1.4, initiative: 1.3, mentoring: 1.2, emotionalStability: 1.2 }
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

export function scoreAssessment(responses: ResponseInput[], signals: BehavioralSignals): ScoreProfile {
  const byId = new Map(assessmentQuestions.map((q) => [q.id, q]));
  const buckets: Record<string, { total: number; weight: number }> = {};

  for (const response of responses) {
    const question = byId.get(response.questionId);
    if (!question || response.skipped) continue;
    const normalized = ((question.reverse ? 6 - response.value : response.value) - 1) * 25;
    buckets[question.trait] ??= { total: 0, weight: 0 };
    buckets[question.trait].total += normalized * question.weight;
    buckets[question.trait].weight += question.weight;
  }

  const traitScores = Object.fromEntries(
    Object.entries(buckets).map(([trait, bucket]) => [trait, clamp(bucket.total / Math.max(bucket.weight, 1))])
  );

  const meanTrait = Object.values(traitScores).reduce((sum, score) => sum + score, 0) / Math.max(Object.keys(traitScores).length, 1);
  const responseQualityPenalty = signals.contradictionRate * 18 + signals.skippedRate * 12 + signals.hesitationRate * 8;
  const psychProfileScore = clamp(meanTrait - responseQualityPenalty);

  const roleAlignment = Object.fromEntries(
    Object.entries(roleWeights).map(([role, weights]) => {
      let weighted = 0;
      let totalWeight = 0;
      for (const [trait, weight] of Object.entries(weights)) {
        weighted += (traitScores[trait] ?? 50) * weight;
        totalWeight += weight;
      }
      return [role, clamp(weighted / totalWeight)];
    })
  );

  const leadershipReadiness = clamp(
    ((traitScores.strategicThinking ?? 50) + (traitScores.initiative ?? 50) + (traitScores.mentoring ?? 50) + (traitScores.emotionalStability ?? 50)) / 4
  );
  const burnoutLikelihood = clamp(100 - ((traitScores.resilience ?? 50) + (traitScores.pressureHandling ?? 50) + (traitScores.emotionalStability ?? 50)) / 3 + signals.hesitationRate * 12);
  const integrityAdvisory = clamp(((traitScores.honesty ?? 50) + (traitScores.accountability ?? 50)) / 2 - signals.contradictionRate * 20);
  const retentionRisk = clamp(burnoutLikelihood * 0.45 + (100 - leadershipReadiness) * 0.2 + signals.skippedRate * 20 + Math.max(0, 50 - (signals.transcriptSentiment ?? 50)) * 0.35);

  const trainingNeeds = [
    traitScores.conscientiousness < 60 ? "Execution discipline and deadline management" : "",
    traitScores.empathy < 60 ? "Stakeholder empathy and communication" : "",
    traitScores.strategicThinking < 60 ? "Strategic planning and commercial reasoning" : "",
    burnoutLikelihood > 65 ? "Stress recovery and workload management" : ""
  ].filter(Boolean);

  const advisoryFlags = [
    signals.contradictionRate > 0.25 ? "Response inconsistency requires human review" : "",
    burnoutLikelihood > 70 ? "Elevated burnout indicator" : "",
    integrityAdvisory < 45 ? "Integrity-related answers require structured follow-up" : "",
    retentionRisk > 70 ? "Retention risk indicator requires manager context" : ""
  ].filter(Boolean);

  return {
    traitScores,
    psychProfileScore,
    roleAlignment,
    leadershipReadiness,
    burnoutLikelihood,
    integrityAdvisory,
    retentionRisk,
    trainingNeeds,
    advisoryFlags,
    recommendedAction: advisoryFlags.length ? "Proceed with structured interview and documented human review." : "Proceed to role-specific interview review.",
    humanReviewRequired: true
  };
}

export function generateInterviewQuestions(role: string, profile: ScoreProfile): string[] {
  const weakTraits = Object.entries(profile.traitScores)
    .filter(([, score]) => score < 62)
    .map(([trait]) => trait);
  const questions = [
    `For a ${role} role, describe a recent work decision where you had to balance speed, quality, and accountability.`,
    "Tell us about a mistake you made at work, what you disclosed, and what changed afterward.",
    "Describe a situation where conflict affected delivery. How did you respond?"
  ];
  if (weakTraits.includes("conscientiousness")) questions.push("How do you manage deadlines when handling multiple priorities?");
  if (weakTraits.includes("emotionalStability")) questions.push("Walk us through a high-pressure moment and how you kept your judgement steady.");
  if (weakTraits.includes("empathy")) questions.push("How do you adapt your communication when a teammate is frustrated or disengaged?");
  if (profile.advisoryFlags.length) questions.push("What would your last manager say is the main behavior you are actively improving?");
  return questions.slice(0, 6);
}

export function compositeTalentScore(profile: ScoreProfile, behavioral: Record<string, number>) {
  const mediaMean =
    Object.values(behavioral).reduce((sum, value) => sum + value, 0) / Math.max(Object.values(behavioral).length, 1);
  return clamp(profile.psychProfileScore * 0.45 + profile.leadershipReadiness * 0.2 + profile.integrityAdvisory * 0.15 + mediaMean * 0.2);
}

