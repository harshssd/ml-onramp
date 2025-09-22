'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Target, CheckCircle, RotateCcw, Brain, Zap, Download, Upload } from 'lucide-react';

interface DigitRecognizerWidgetProps {
  onComplete?: () => void;
}

interface DigitData {
  id: number;
  pixels: number[];
  label: number;
  predicted?: number;
  confidence?: number;
}

export default function DigitRecognizerWidget({ onComplete }: DigitRecognizerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [digits, setDigits] = useState<DigitData[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate sample MNIST-like digits
  const generateSampleDigits = () => {
    const sampleDigits: DigitData[] = [];
    
    // Generate 20 sample digits (0-9)
    for (let i = 0; i < 20; i++) {
      const label = i % 10;
      const pixels = generateDigitPixels(label);
      sampleDigits.push({
        id: i + 1,
        pixels,
        label
      });
    }
    
    setDigits(sampleDigits);
  };

  const generateDigitPixels = (digit: number): number[] => {
    const pixels = new Array(28 * 28).fill(0);
    
    // Simple pattern generation for each digit
    switch (digit) {
      case 0:
        // Circle pattern
        for (let y = 4; y < 24; y++) {
          for (let x = 4; x < 24; x++) {
            const dist = Math.sqrt(Math.pow(x - 14, 2) + Math.pow(y - 14, 2));
            if (dist > 8 && dist < 12) {
              pixels[y * 28 + x] = 1;
            }
          }
        }
        break;
      case 1:
        // Vertical line
        for (let y = 4; y < 24; y++) {
          pixels[y * 28 + 14] = 1;
          if (y > 8) pixels[y * 28 + 13] = 1;
        }
        break;
      case 2:
        // Z pattern
        for (let x = 4; x < 24; x++) pixels[4 * 28 + x] = 1;
        for (let x = 4; x < 24; x++) pixels[14 * 28 + x] = 1;
        for (let x = 4; x < 24; x++) pixels[24 * 28 + x] = 1;
        for (let y = 4; y < 14; y++) pixels[y * 28 + 23] = 1;
        for (let y = 14; y < 24; y++) pixels[y * 28 + 4] = 1;
        break;
      // Add more digit patterns...
      default:
        // Random pattern for other digits
        for (let i = 0; i < 100; i++) {
          const idx = Math.floor(Math.random() * pixels.length);
          pixels[idx] = Math.random() > 0.5 ? 1 : 0;
        }
    }
    
    return pixels;
  };

  useEffect(() => {
    generateSampleDigits();
  }, []);

  const trainModel = async () => {
    setIsTraining(true);
    
    // Simulate training process
    for (let epoch = 0; epoch < 5; epoch++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update digits with predictions
      const updatedDigits = digits.map(digit => {
        // Simple prediction based on pixel patterns
        let predicted = 0;
        let confidence = 0.5;
        
        // Count active pixels in different regions
        const topPixels = digit.pixels.slice(0, 14 * 28).filter(p => p > 0).length;
        const middlePixels = digit.pixels.slice(14 * 28, 21 * 28).filter(p => p > 0).length;
        const bottomPixels = digit.pixels.slice(21 * 28).filter(p => p > 0).length;
        
        if (topPixels > 50 && bottomPixels > 50) {
          predicted = 8; // 8 has pixels top and bottom
          confidence = 0.9;
        } else if (middlePixels > 30) {
          predicted = 1; // 1 has middle line
          confidence = 0.8;
        } else if (topPixels > 40) {
          predicted = 0; // 0 has top circle
          confidence = 0.7;
        } else {
          predicted = Math.floor(Math.random() * 10);
          confidence = 0.3;
        }
        
        return {
          ...digit,
          predicted,
          confidence
        };
      });
      
      setDigits(updatedDigits);
    }
    
    // Calculate accuracy
    const correct = digits.filter(d => d.label === d.predicted).length;
    setAccuracy(Math.round((correct / digits.length) * 100));
    setModelTrained(true);
    setIsTraining(false);
  };

  const drawDigit = (pixels: number[], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = 28;
    const scale = canvas.width / size;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = themeClasses.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const pixel = pixels[y * size + x];
        if (pixel > 0) {
          ctx.fillStyle = `rgba(0, 0, 0, ${pixel})`;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Digit Recognizer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Train a model to recognize handwritten digits (MNIST case study)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>MNIST Digit Recognition:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• <strong>MNIST:</strong> 70,000 handwritten digit images (0-9)</li>
            <li>• <strong>Challenge:</strong> Train a model to recognize digits in new images</li>
            <li>• <strong>Features:</strong> Each pixel is a feature (28×28 = 784 features)</li>
            <li>• <strong>Success:</strong> This was a breakthrough in computer vision</li>
          </ul>
        </div>

        {/* Training Controls */}
        <div className="flex space-x-4">
          <Button
            onClick={trainModel}
            disabled={isTraining}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isTraining ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Training Model...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Train Model
              </>
            )}
          </Button>
          <Button
            onClick={generateSampleDigits}
            variant="outline"
            className={`${themeClasses.border}`}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            New Sample
          </Button>
        </div>

        {/* Sample Digits Grid */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Sample Digits</h4>
          <div className="grid grid-cols-5 gap-4">
            {digits.slice(0, 10).map(digit => (
              <div key={digit.id} className="text-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={56}
                    height={56}
                    className="border rounded bg-white dark:bg-gray-900 mx-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  {modelTrained && digit.predicted !== undefined && (
                    <div className="absolute -top-2 -right-2">
                      <Badge 
                        className={`${
                          digit.label === digit.predicted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {digit.predicted}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className={`text-xs ${themeClasses.text}/70 mt-1`}>
                  True: {digit.label}
                  {modelTrained && digit.confidence && (
                    <div>Conf: {Math.round(digit.confidence * 100)}%</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance */}
        {modelTrained && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Model Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{accuracy}%</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{digits.length}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Training Examples</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">784</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Features (pixels)</div>
              </div>
            </div>
          </div>
        )}

        {/* Historical Context */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Why MNIST Matters</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Breakthrough:</strong> MNIST proved neural networks could solve real-world problems.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Standard:</strong> Became the "hello world" of machine learning for decades.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Foundation:</strong> Led to modern computer vision and deep learning.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Legacy:</strong> Still used today to test new algorithms and techniques.
              </p>
            </div>
          </div>
        </div>

        {/* Real-world Applications */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Real-world Applications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Direct Applications:</h5>
              <ul className={`space-y-1 ${themeClasses.text}/80`}>
                <li>• Postal code recognition</li>
                <li>• Bank check processing</li>
                <li>• Form digitization</li>
                <li>• Captcha solving</li>
              </ul>
            </div>
            <div>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Inspired Applications:</h5>
              <ul className={`space-y-1 ${themeClasses.text}/80`}>
                <li>• Medical image analysis</li>
                <li>• Autonomous driving</li>
                <li>• Facial recognition</li>
                <li>• Natural language processing</li>
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
              I Understand Digit Recognition
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Congratulations!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've completed the MNIST case study! This classic example shows how machine learning 
              can solve real-world problems and has inspired countless innovations in AI.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
