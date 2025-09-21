"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle, XCircle, Trophy, Star, Zap, Crown, Target } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Flashcard {
  track: string;
  card_front: string;
  card_back: string;
}

interface FlashcardSystemProps {
  track: string;
  onComplete?: () => void;
}

export default function FlashcardSystem({ track, onComplete }: FlashcardSystemProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [userXP, setUserXP] = useState(1250); // Mock XP
  const [streak, setStreak] = useState(0); // Current session streak

  useEffect(() => {
    loadFlashcards();
  }, [track]);

  const loadFlashcards = async () => {
    try {
      const response = await fetch(`/api/content/flashcards/${track}`);
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      } else {
        // Fallback to mock data
        setCards([
          { track: "fundamentals", card_front: "What is 'loss'?", card_back: "A scalar measuring prediction error used to tune parameters." },
          { track: "fundamentals", card_front: "Train/Val/Test—why split?", card_back: "To estimate generalization and avoid overfitting/leakage." },
          { track: "fundamentals", card_front: "What is a 'feature'?", card_back: "An input variable (e.g., age, income) used to make predictions." },
          { track: "fundamentals", card_front: "What is 'overfitting'?", card_back: "When a model memorizes training data but fails on new data." },
          { track: "fundamentals", card_front: "What is 'bias' in ML?", card_back: "Systematic error that leads to unfair or incorrect predictions." }
        ]);
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
      // Use fallback data
      setCards([
        { track: "fundamentals", card_front: "What is 'loss'?", card_back: "A scalar measuring prediction error used to tune parameters." },
        { track: "fundamentals", card_front: "Train/Val/Test—why split?", card_back: "To estimate generalization and avoid overfitting/leakage." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = () => {
    setCorrectCount(prev => prev + 1);
    setReviewedCards(prev => new Set([...prev, currentIndex]));
    nextCard();
  };

  const handleIncorrect = () => {
    setIncorrectCount(prev => prev + 1);
    setReviewedCards(prev => new Set([...prev, currentIndex]));
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // All cards reviewed
      if (onComplete) {
        onComplete();
      }
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setReviewedCards(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No flashcards available for this track.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const isComplete = currentIndex >= cards.length - 1 && reviewedCards.has(currentIndex);

  return (
    <div className={`max-w-4xl mx-auto p-6 ${themeClasses.background}`}>
      {/* RPG-Style Header */}
      <div className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} rounded-lg p-6 mb-6 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🧠</div>
            <div>
              <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Memory Training Arena</h2>
              <p className={`text-sm ${themeClasses.text}/70`}>Master {track} concepts through spaced repetition</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${themeClasses.text}`}>Level {Math.floor(userXP / 500) + 1}</div>
              <div className="text-xs text-gray-500">{userXP} XP</div>
            </div>
            <Button variant="outline" size="sm" onClick={resetSession} className="flex items-center">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Session
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} rounded-lg p-4 mb-6 shadow-lg`}>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="flex items-center">
            <Target className="h-4 w-4 mr-1" />
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} rounded-lg p-4 mb-6 shadow-lg`}>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-red-600">{incorrectCount}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-blue-600">{reviewedCards.size}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-yellow-600">{streak}</div>
            <div className="text-sm text-gray-600">Streak</div>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} mb-6 min-h-[300px] flex items-center justify-center shadow-lg`}>
        <CardContent className="p-8 text-center">
          <div className="text-2xl mb-4">💭</div>
          <div className={`text-xl font-medium mb-6 ${themeClasses.text}`}>
            {isFlipped ? currentCard.card_back : currentCard.card_front}
          </div>
          <Button 
            onClick={handleFlip}
            className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isFlipped ? '🔄 Show Question' : '💡 Show Answer'}
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} rounded-lg p-4 shadow-lg`}>
        <div className="flex justify-between items-center">
          <Button 
            onClick={prevCard} 
            disabled={currentIndex === 0}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            {isFlipped && (
              <>
                <Button 
                  onClick={handleIncorrect}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  ❌ Incorrect
                </Button>
                <Button 
                  onClick={handleCorrect}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  ✅ Correct
                </Button>
              </>
            )}
          </div>

          <Button 
            onClick={nextCard} 
            disabled={currentIndex >= cards.length - 1}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Quest Complete! Memory Training Mastered!
            </h3>
            <p className="text-green-700 mb-4 text-lg">
              You've reviewed all {cards.length} flashcards!
            </p>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 mb-6">
              <div className="flex justify-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                  <div className="text-sm text-green-700">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">+{correctCount * 10}</div>
                  <div className="text-sm text-yellow-700">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round((correctCount / (correctCount + incorrectCount)) * 100)}%</div>
                  <div className="text-sm text-blue-700">Accuracy</div>
                </div>
              </div>
            </div>
            <Button 
              onClick={resetSession} 
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Practice Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
