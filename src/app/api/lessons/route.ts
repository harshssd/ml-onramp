import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .order('id');

    if (error) {
      console.error('Database error loading lessons:', error);
      return NextResponse.json({ error: 'Failed to load lessons from database' }, { status: 500 });
    }

    return NextResponse.json(lessons || []);
  } catch (error) {
    console.error('Error loading lessons:', error);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
}
