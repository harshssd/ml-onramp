import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ track: string }> }
) {
  try {
    const { track } = await params;
    const filePath = path.join(process.cwd(), 'content', 'flashcards', `${track}.csv`);

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const flashcards = lines.slice(1).map(line => {
      const values = line.split(',');
      const card: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        card[header.trim()] = values[index].trim();
      });
      return card;
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
