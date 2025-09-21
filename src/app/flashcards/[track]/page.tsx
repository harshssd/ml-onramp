"use client";

import React from "react";
import { useParams } from "next/navigation";
import FlashcardSystem from "@/components/FlashcardSystem";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FlashcardPage() {
  const params = useParams();
  const track = params?.track as string;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/learning-path/fundamentals">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Learning Path
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Flashcard Practice</h1>
              <p className="text-gray-600">Track: {track}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Flashcard System */}
      <div className="py-8">
        <FlashcardSystem 
          track={track} 
          onComplete={() => {
            // Handle completion
            console.log('Flashcard session completed!');
          }}
        />
      </div>
    </div>
  );
}
