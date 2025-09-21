import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface LessonFrontmatter {
  id: string;
  title: string;
  duration_min: number;
  prereqs: string[];
  tags: string[];
  video?: {
    platform: string;
    id: string;
    start: number;
    end: number;
  };
  widgets: string[];
  goals: string[];
  quiz: Array<{
    q: string;
    options: string[];
    answer: number;
    explain: string;
  }>;
  tasks: string[];
  reflection: string[];
  next: string;
}

export interface LessonContent {
  frontmatter: LessonFrontmatter;
  content: string;
  slug: string;
}

export async function GET() {
  try {
    const contentDir = 'content';
    const lessons: LessonContent[] = [];

    // Get all tracks
    const tracksPath = path.join(process.cwd(), contentDir, 'tracks');
    if (!fs.existsSync(tracksPath)) {
      return NextResponse.json([]);
    }

    const tracks = fs.readdirSync(tracksPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Parse lessons from all tracks
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

          lessons.push({
            frontmatter: data as LessonFrontmatter,
            content,
            slug: path.basename(file, '.md')
          });
        }
      }
    }

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error loading lessons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
