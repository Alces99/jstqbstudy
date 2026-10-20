import { NextResponse } from 'next/server';
import { initialQuickQuestions, initialScenarioGroups } from '@/lib/questionsData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode === 'quick') {
    return NextResponse.json({ questions: initialQuickQuestions });
  }

  if (mode === 'scenario') {
    return NextResponse.json({ scenario_groups: initialScenarioGroups });
  }

  return NextResponse.json({
    quick_questions: initialQuickQuestions,
    scenario_groups: initialScenarioGroups
  });
}

