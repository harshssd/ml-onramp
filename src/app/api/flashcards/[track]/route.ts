import { NextRequest, NextResponse } from 'next/server';
import { contentParser } from '@/lib/content-parser';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ track: string }> }
) {
  try {
    const { track } = await params;
    const flashcards = contentParser.parseFlashcards(track);

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
