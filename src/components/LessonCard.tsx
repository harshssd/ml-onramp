import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  slug: string;
  isCompleted?: boolean;
  content?: {
    sections?: Array<{
      title: string;
      content: string;
    }>;
  };
}

interface LessonCardProps {
  lesson: Lesson;
  onStart: (slug: string) => void;
}

export function LessonCard({ lesson, onStart }: LessonCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {lesson.isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
              {lesson.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {lesson.description}
            </CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
            {lesson.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lesson.duration} min
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Lesson
            </div>
          </div>
          <Button onClick={() => onStart(lesson.slug)} variant="default">
            {lesson.isCompleted ? 'Review' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
