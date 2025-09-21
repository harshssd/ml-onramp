"use client";

import { useState } from "react";
import { getLessonById, getAllLessons } from "@/data/aiFundamentalsContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestLessonPage() {
  const [selectedLesson, setSelectedLesson] = useState<string>("lesson-1-1");
  const lessons = getAllLessons();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Learning - Lesson Test Page</h1>
        
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Lessons</h2>
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>⏱️ {lesson.estimatedTime}</span>
                      <span>📊 {lesson.difficulty}</span>
                      <span>🎯 {lesson.type}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedLesson(lesson.id)}
                    variant={selectedLesson === lesson.id ? "default" : "outline"}
                    size="sm"
                  >
                    {selectedLesson === lesson.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Lesson</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to test the lesson with the new interactive components.
          </p>
          <Link href={`/lesson/${selectedLesson}`}>
            <Button size="lg">
              Test Lesson: {getLessonById(selectedLesson)?.title}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
