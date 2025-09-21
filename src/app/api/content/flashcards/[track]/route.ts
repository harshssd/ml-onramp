import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ track: string }> }
) {
  try {
    const { track } = await params;
    const csvPath = path.join(process.cwd(), 'content', 'flashcards', `${track}.csv`);
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json([]);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    const flashcards = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        track: values[0],
        card_front: values[1],
        card_back: values[2]
      };
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
