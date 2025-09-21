'use client';

import React, { useState, useEffect } from 'react';
import { CharacterCreation } from '@/components/CharacterCreation';
import { LearningPathSelector } from '@/components/LearningPathSelector';
import { StoryInterface } from '@/components/StoryInterface';
import { Character } from '@/data/storyData';

type AppState = 'character-creation' | 'path-selection' | 'story';

export default function LearningPage() {
  const [appState, setAppState] = useState<AppState>('character-creation');
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState<string>('chapter-1');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  // Check for path parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    if (pathParam) {
      setSelectedPath(pathParam);
      setAppState('story');
    }
  }, []);

  const handleCharacterComplete = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setAppState('path-selection');
  };

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId);
    setAppState('story');
    // Set the first chapter based on the selected path
    if (pathId === 'data-explorer') {
      setCurrentChapter('chapter-1');
    }
    // Add other path mappings here
  };

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const handleChapterComplete = (chapterId: string) => {
    setCompletedChapters(prev => new Set([...prev, chapterId]));
    // Move to next chapter or complete the path
    if (chapterId === 'chapter-1') {
      setCurrentChapter('chapter-2');
    } else if (chapterId === 'chapter-2') {
      setCurrentChapter('chapter-3');
    } else if (chapterId === 'chapter-3') {
      setCurrentChapter('chapter-4');
    } else if (chapterId === 'chapter-4') {
      setCurrentChapter('chapter-5');
    } else if (chapterId === 'chapter-5') {
      // Path completed!
      setAppState('path-selection');
    }
  };

  // const handleBackToPathSelection = () => {
  //   setAppState('path-selection');
  // };

  const handleBackToCharacterCreation = () => {
    setAppState('character-creation');
    setCharacter(null);
    setSelectedPath(null);
    setCurrentChapter('chapter-1');
    setCompletedLessons(new Set());
    setCompletedChapters(new Set());
  };

  if (!character) {
    return (
      <CharacterCreation onComplete={handleCharacterComplete} />
    );
  }

  if (appState === 'path-selection') {
    return (
      <LearningPathSelector
        character={character}
        onPathSelect={handlePathSelect}
        onBack={handleBackToCharacterCreation}
      />
    );
  }

  if (appState === 'story' && selectedPath) {
    return (
      <StoryInterface
        character={character}
        currentChapterId={currentChapter}
        onChapterComplete={handleChapterComplete}
        onLessonComplete={handleLessonComplete}
      />
    );
  }

  return null;
}
