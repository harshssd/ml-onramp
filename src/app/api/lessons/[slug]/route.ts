import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Database error loading lesson:', error);
      return NextResponse.json({ error: 'Failed to load lesson from database' }, { status: 500 });
    }

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error loading lesson:', error);
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 });
  }
}
