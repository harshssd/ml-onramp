'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storyCourses, getCourseById } from '@/data/storyCourses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  BookOpen, 
  Users, 
  Target, 
  CheckCircle, 
  Lock, 
  Unlock,
  Star,
  Award,
  TrendingUp,
  Lightbulb,
  Shield,
  Rocket
} from 'lucide-react';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const courseData = getCourseById(params.id);
    setCourse(courseData);
  }, [params.id]);

  if (!course) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${themeClasses.text}`}>Loading course...</p>
        </div>
      </div>
    );
  }

  const handleStartCourse = () => {
    if (course.chapters.length > 0) {
      router.push(course.chapters[0].path);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Star className="h-4 w-4" />;
      case 'intermediate': return <Target className="h-4 w-4" />;
      case 'advanced': return <Award className="h-4 w-4" />;
      case 'expert': return <Rocket className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className={`${themeClasses.border}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div className="text-3xl">{course.icon}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h1 className={`text-5xl font-bold ${themeClasses.text}`}>
              {course.title}
            </h1>
            <Badge className={`${getDifficultyColor(course.difficulty)} text-white text-lg px-4 py-2`}>
              {getDifficultyIcon(course.difficulty)}
              <span className="ml-2 capitalize">{course.difficulty}</span>
            </Badge>
          </div>
          <h2 className={`text-3xl ${themeClasses.text}/70 mb-6`}>
            {course.subtitle}
          </h2>
          <p className={`text-xl ${themeClasses.text}/80 max-w-4xl mx-auto mb-8`}>
            {course.description}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text} flex items-center`}>
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                The Hook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text} italic text-lg`}>
                "{course.story.hook}"
              </p>
            </CardContent>
          </Card>

          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text} flex items-center`}>
                <Rocket className="h-5 w-5 mr-2 text-blue-500" />
                The Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text}`}>
                {course.story.journey}
              </p>
            </CardContent>
          </Card>

          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text} flex items-center`}>
                <Award className="h-5 w-5 mr-2 text-green-500" />
                The Outcome
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text}`}>
                {course.story.outcome}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Course Stats */}
          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text}`}>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className={`${themeClasses.text}`}>Duration</span>
                  </div>
                  <span className={`${themeClasses.text} font-medium`}>{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-400" />
                    <span className={`${themeClasses.text}`}>Chapters</span>
                  </div>
                  <span className={`${themeClasses.text} font-medium`}>{course.chapters.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    <span className={`${themeClasses.text}`}>Level</span>
                  </div>
                  <span className={`${themeClasses.text} font-medium capitalize`}>{course.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                    <span className={`${themeClasses.text}`}>Estimated Hours</span>
                  </div>
                  <span className={`${themeClasses.text} font-medium`}>{course.estimatedHours}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Prerequisites */}
          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text}`}>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className={`${themeClasses.card.replace('/10', '/20')}`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Prerequisites:</h4>
                  <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                    {course.prerequisites.map((prereq: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Target Audience */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-12`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Perfect For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {course.targetAudience.map((audience: string, index: number) => (
                <Badge key={index} variant="outline" className={`${themeClasses.border} px-4 py-2`}>
                  {audience}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chapter Breakdown */}
        <div className="mb-12">
          <h3 className={`text-3xl font-bold ${themeClasses.text} mb-8 text-center`}>
            Your Learning Journey
          </h3>
          <div className="space-y-6">
            {course.chapters.map((chapter: any, index: number) => (
              <Card key={chapter.id} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{chapter.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className={`text-2xl ${themeClasses.text}`}>
                          Chapter {index + 1}: {chapter.title}
                        </CardTitle>
                        {chapter.locked ? (
                          <Lock className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Unlock className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                      <CardDescription className={`text-lg ${themeClasses.text}/70 mb-4`}>
                        {chapter.description}
                      </CardDescription>
                      
                      {/* Chapter Story */}
                      <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} mb-4`}>
                        <div className="space-y-2">
                          <div>
                            <span className={`font-semibold ${themeClasses.text}`}>Setup: </span>
                            <span className={`${themeClasses.text}`}>{chapter.story.setup}</span>
                          </div>
                          <div>
                            <span className={`font-semibold ${themeClasses.text}`}>Challenge: </span>
                            <span className={`${themeClasses.text}`}>{chapter.story.challenge}</span>
                          </div>
                          <div>
                            <span className={`font-semibold ${themeClasses.text}`}>Resolution: </span>
                            <span className={`${themeClasses.text}`}>{chapter.story.resolution}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className={`text-sm ${themeClasses.text}/70`}>{chapter.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-green-400" />
                          <span className={`text-sm ${themeClasses.text}/70`}>{chapter.lessons} lessons</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} max-w-2xl mx-auto`}>
            <CardContent className="p-8">
              <div className="text-4xl mb-4">{course.icon}</div>
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
                Ready to Begin Your Journey?
              </h3>
              <p className={`text-lg ${themeClasses.text}/70 mb-6`}>
                Join thousands of learners who are already transforming their future with AI.
              </p>
              <Button
                onClick={handleStartCourse}
                className={`bg-gradient-to-r ${course.gradient} hover:opacity-90 text-white px-8 py-4 text-lg`}
                disabled={course.chapters[0]?.locked}
              >
                {course.chapters[0]?.locked ? (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Complete Previous Course
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Learning Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
