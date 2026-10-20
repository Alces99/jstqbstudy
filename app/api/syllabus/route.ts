import { NextResponse } from 'next/server';
import { syllabiList, syllabusSections } from '@/lib/syllabusData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const sectionId = searchParams.get('sectionId');

  if (sectionId) {
    const section = syllabusSections.find(s => s.id === sectionId);
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }
    return NextResponse.json({ section });
  }

  if (code) {
    const sections = syllabusSections.filter(s => s.syllabus_code === code);
    const syllabus = syllabiList.find(s => s.code === code);
    return NextResponse.json({ syllabus, sections });
  }

  return NextResponse.json({
    syllabi: syllabiList,
    sections: syllabusSections
  });
}

