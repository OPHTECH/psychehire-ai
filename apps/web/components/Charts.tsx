"use client";

import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TraitRadar({ traits }: { traits: Record<string, number> }) {
  const data = Object.entries(traits).map(([trait, score]) => ({ trait, score }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11 }} />
        <Radar dataKey="score" fill="#245343" fillOpacity={0.22} stroke="#245343" />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function TalentBars({ data }: { data: { department: string; potential: number; burnout: number; retention: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={330}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="potential" fill="#245343" />
        <Bar dataKey="burnout" fill="#c8d2a2" />
        <Bar dataKey="retention" fill="#86a58f" />
      </BarChart>
    </ResponsiveContainer>
  );
}

