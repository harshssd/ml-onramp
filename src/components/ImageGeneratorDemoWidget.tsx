'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Wand2, Download, Share2, CheckCircle, Sparkles } from 'lucide-react';

interface ImageGeneratorDemoWidgetProps {
  onComplete?: () => void;
}

interface GeneratedImage {
  id: string;
  prompt: string;
  image: string;
  timestamp: Date;
}

export default function ImageGeneratorDemoWidget({ onComplete }: ImageGeneratorDemoWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [completed, setCompleted] = useState(false);

  // Sample prompts for inspiration
  const samplePrompts = [
    "A futuristic city at sunset",
    "A cute robot playing with a cat",
    "Abstract art with vibrant colors",
    "A magical forest with glowing mushrooms",
    "A steampunk airship in the clouds",
    "A minimalist landscape with mountains"
  ];

  // Generate a simple ASCII art based on prompt
  const generateASCIIArt = (prompt: string): string => {
    const keywords = prompt.toLowerCase().split(' ');
    
    if (keywords.includes('robot') || keywords.includes('ai')) {
      return `
    ┌─────────────────┐
    │  🤖 AI ROBOT 🤖  │
    │                 │
    │    ┌─────┐      │
    │    │  ◉  │      │
    │    └─────┘      │
    │   /       \\     │
    │  /         \\    │
    │ /           \\   │
    └─────────────────┘
      `;
    } else if (keywords.includes('cat') || keywords.includes('animal')) {
      return `
    ┌─────────────────┐
    │  🐱 CUTE CAT 🐱  │
    │                 │
    │    /\\_/\\        │
    │   ( o.o )       │
    │    > ^ <        │
    │   /     \\       │
    │  /       \\      │
    └─────────────────┘
      `;
    } else if (keywords.includes('city') || keywords.includes('urban')) {
      return `
    ┌─────────────────┐
    │  🏙️ CITY SCAPE 🏙️ │
    │                 │
    │  ████████████████│
    │  ████████████████│
    │  ████████████████│
    │  ████████████████│
    │  ████████████████│
    └─────────────────┘
      `;
    } else if (keywords.includes('forest') || keywords.includes('nature')) {
      return `
    ┌─────────────────┐
    │  🌲 FOREST 🌲   │
    │                 │
    │      /\\         │
    │     /  \\        │
    │    /    \\       │
    │   /      \\      │
    │  /        \\     │
    └─────────────────┘
      `;
    } else {
      return `
    ┌─────────────────┐
    │  🎨 ABSTRACT 🎨  │
    │                 │
    │  ╔═══════════╗  │
    │  ║  ◉  ◉  ◉  ║  │
    │  ║  ◉  ◉  ◉  ║  │
    │  ║  ◉  ◉  ◉  ║  │
    │  ╚═══════════╝  │
    └─────────────────┘
      `;
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      image: generateASCIIArt(prompt),
      timestamp: new Date()
    };
    
    setGeneratedImages(prev => [newImage, ...prev]);
    setPrompt('');
    setIsGenerating(false);
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const shareImage = (image: GeneratedImage) => {
    if (navigator.share) {
      navigator.share({
        title: 'My AI Generated Art',
        text: `Check out this AI-generated image: "${image.prompt}"`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`AI Generated Art: "${image.prompt}"\n\n${image.image}`);
      alert('Image description copied to clipboard!');
    }
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Palette className="h-5 w-5 mr-2 text-blue-500" />
          AI Image Generator Demo
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Experience how AI creates art from text descriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>How AI Image Generation Works:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• <strong>Text Input:</strong> You describe what you want to see</li>
            <li>• <strong>Pattern Learning:</strong> AI learned from millions of image-text pairs</li>
            <li>• <strong>Generation:</strong> AI creates new images based on learned patterns</li>
            <li>• <strong>Creativity:</strong> Each generation is unique, even with the same prompt</li>
          </ul>
        </div>

        {/* Prompt Input */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Create Your Art</h4>
          <div className="flex space-x-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && generateImage()}
            />
            <Button
              onClick={generateImage}
              disabled={!prompt.trim() || isGenerating}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
          
          {/* Sample Prompts */}
          <div className="space-y-2">
            <p className={`text-sm ${themeClasses.text}/70`}>Try these sample prompts:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((samplePrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(samplePrompt)}
                  className={`${themeClasses.border} text-xs`}
                >
                  {samplePrompt}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Your Generated Art</h4>
            <div className="space-y-4">
              {generatedImages.map((image) => (
                <div
                  key={image.id}
                  className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`font-medium ${themeClasses.text}`}>"{image.prompt}"</p>
                      <p className={`text-xs ${themeClasses.text}/70`}>
                        Generated {image.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => shareImage(image)}
                      variant="outline"
                      size="sm"
                      className={`${themeClasses.border}`}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded border font-mono text-xs overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{image.image}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Creativity Insights */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Understanding AI Creativity</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Pattern-Based:</strong> AI doesn't "think" creatively - it combines learned patterns in new ways.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Training Data:</strong> The quality of AI art depends on what it was trained on.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Human-AI Collaboration:</strong> The best results come from humans guiding AI creativity.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Limitations:</strong> AI can't truly understand context or emotion like humans do.
              </p>
            </div>
          </div>
        </div>

        {/* Real-world Applications */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Real-world Applications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Creative Industries:</h5>
              <ul className={`space-y-1 ${themeClasses.text}/80`}>
                <li>• Concept art for games/movies</li>
                <li>• Marketing and advertising visuals</li>
                <li>• Book cover illustrations</li>
                <li>• Fashion design inspiration</li>
              </ul>
            </div>
            <div>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Practical Uses:</h5>
              <ul className={`space-y-1 ${themeClasses.text}/80`}>
                <li>• Website mockups and prototypes</li>
                <li>• Social media content creation</li>
                <li>• Educational materials</li>
                <li>• Personal art projects</li>
              </ul>
            </div>
          </div>
        </div>

        {!completed && (
          <div className="text-center">
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              I Understand AI Creativity
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Amazing!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've experienced AI creativity firsthand! This technology is transforming 
              how we create art, music, and content. The future of creativity is human-AI collaboration.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
