import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Try all chapters and search by frontmatter ID
    const chapters = ['chapter1', 'chapter2', 'chapter3', 'chapter4'];
    let filePath = '';
    
    for (const chapter of chapters) {
      const chapterPath = path.join(process.cwd(), 'content', 'awakening', chapter);
      if (fs.existsSync(chapterPath)) {
        const files = fs.readdirSync(chapterPath);
        for (const file of files) {
          if (file.endsWith('.md')) {
            const testPath = path.join(chapterPath, file);
            try {
              const fileContents = fs.readFileSync(testPath, 'utf8');
              const { data: frontmatter } = matter(fileContents);
              if (frontmatter.id === id) {
                filePath = testPath;
                break;
              }
            } catch (error) {
              // Skip files that can't be parsed
              continue;
            }
          }
        }
        if (filePath) break;
      }
    }
    
    // Check if file exists
    if (!filePath || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    // Read the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContents);
    
    return NextResponse.json({
      frontmatter,
      content
    });
    
  } catch (error) {
    console.error('Error reading lesson:', error);
    return NextResponse.json({ error: 'Failed to read lesson' }, { status: 500 });
  }
}