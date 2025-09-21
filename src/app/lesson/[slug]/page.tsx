"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LessonTemplate from "@/components/LessonTemplate";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LessonPage() {
  const params = useParams();
  const [lesson, setLesson] = useState<{ frontmatter: { id: string; title: string; duration_min: number; tags: string[]; goals: string[] }; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLesson();
  }, [params?.slug]);

  const loadLesson = async () => {
    try {
      const slug = params?.slug as string;
      if (!slug) {
        setError("No lesson specified");
        return;
      }

      // Try to load from content API by ID (slug is the same as ID in our case)
      try {
        console.log('Fetching lesson:', slug);
        const response = await fetch(`/api/content/lessons/${slug}`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const lessonData = await response.json();
          console.log('Lesson data received:', lessonData);
          setLesson(lessonData);
          return;
        } else {
          console.log('Response not ok:', response.status, response.statusText);
        }
      } catch (apiError) {
        console.log('Content API error:', apiError);
      }

      // Fallback to old API
      try {
        const response = await fetch(`/api/lessons?slug=${slug}`);
        if (response.ok) {
          const lessons = await response.json();
          const lessonData = lessons.find((l: { slug: string }) => l.slug === slug);
          if (lessonData) {
            setLesson(lessonData);
            return;
          }
        }
      } catch (apiError) {
        console.log('Fallback API not available');
      }

      setError("Lesson not found");
    } catch (error) {
      console.error('Error loading lesson:', error);
      setError("Failed to load lesson");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = (lessonId: string) => {
    console.log('Lesson completed:', lessonId);
    // TODO: Update progress in database
  };

  const handleNext = (nextLessonId: string) => {
    // Navigate to next lesson
    window.location.href = `/lesson/${nextLessonId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The lesson you're looking for doesn't exist."}</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LessonTemplate
      lesson={lesson}
      onComplete={handleComplete}
      onNext={handleNext}
    />
  );
}