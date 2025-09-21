import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentDir = 'content';

    // Search through all tracks for the lesson
    const tracksPath = path.join(process.cwd(), contentDir, 'tracks');
    if (!fs.existsSync(tracksPath)) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const tracks = fs.readdirSync(tracksPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const track of tracks) {
      const trackPath = path.join(tracksPath, track);
      const chapters = fs.readdirSync(trackPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const chapter of chapters) {
        const chapterPath = path.join(trackPath, chapter);
        const files = fs.readdirSync(chapterPath)
          .filter(file => file.endsWith('.md'));

        for (const file of files) {
          const filePath = path.join(chapterPath, file);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContents);

          if (data.id === id) {
            return NextResponse.json({
              frontmatter: data,
              content,
              slug: path.basename(file, '.md')
            });
          }
        }
      }
    }

    return NextResponse.json(
      { error: 'Lesson not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
