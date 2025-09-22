'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { TrendingUp, AlertTriangle, CheckCircle, RotateCcw, Brain } from 'lucide-react';

interface OverfitPlaygroundWidgetProps {
  onComplete?: () => void;
}

interface DataPoint {
  x: number;
  y: number;
  type: 'train' | 'test';
}

export default function OverfitPlaygroundWidget({ onComplete }: OverfitPlaygroundWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [complexity, setComplexity] = useState([3]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate sample data
  const generateData = () => {
    const points: DataPoint[] = [];
    
    // Generate training data (70% of points)
    for (let i = 0; i < 20; i++) {
      const x = (i / 19) * 100;
      const y = 50 + 30 * Math.sin(x / 20) + (Math.random() - 0.5) * 20;
      points.push({ x, y, type: 'train' });
    }
    
    // Generate test data (30% of points)
    for (let i = 0; i < 8; i++) {
      const x = (i / 7) * 100;
      const y = 50 + 30 * Math.sin(x / 20) + (Math.random() - 0.5) * 20;
      points.push({ x, y, type: 'test' });
    }
    
    setDataPoints(points);
  };

  useEffect(() => {
    generateData();
  }, []);

  // Draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = themeClasses.background;
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = themeClasses.border;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw data points
    dataPoints.forEach(point => {
      const x = (point.x / 100) * width;
      const y = height - (point.y / 100) * height;
      
      ctx.fillStyle = point.type === 'train' ? '#3b82f6' : '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw model curve based on complexity
    if (dataPoints.length > 0) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const trainPoints = dataPoints.filter(p => p.type === 'train');
      const complexityLevel = complexity[0];
      
      for (let x = 0; x <= 100; x += 2) {
        let y = 50;
        
        if (complexityLevel === 1) {
          // Linear (underfitting)
          y = 50 + (x - 50) * 0.3;
        } else if (complexityLevel === 2) {
          // Quadratic (good fit)
          y = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1;
        } else if (complexityLevel === 3) {
          // High degree (overfitting)
          y = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1 + Math.sin(x / 5) * 10;
        } else if (complexityLevel === 4) {
          // Very high degree (severe overfitting)
          y = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1 + Math.sin(x / 5) * 10 + Math.sin(x / 2) * 5;
        } else if (complexityLevel === 5) {
          // Extreme overfitting - try to fit every point
          y = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1 + Math.sin(x / 5) * 10 + Math.sin(x / 2) * 5 + Math.sin(x / 1) * 3;
        }
        
        const canvasX = (x / 100) * width;
        const canvasY = height - (y / 100) * height;
        
        if (x === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      }
      
      ctx.stroke();
    }
    
  }, [dataPoints, complexity, themeClasses.background, themeClasses.border]);

  const calculatePerformance = () => {
    const trainPoints = dataPoints.filter(p => p.type === 'train');
    const testPoints = dataPoints.filter(p => p.type === 'test');
    
    if (trainPoints.length === 0 || testPoints.length === 0) return { train: 0, test: 0 };
    
    // Calculate R² for both sets
    const calculateR2 = (points: DataPoint[]) => {
      const yMean = points.reduce((sum, p) => sum + p.y, 0) / points.length;
      let ssRes = 0;
      let ssTot = 0;
      
      points.forEach(point => {
        const x = point.x;
        let predictedY = 50;
        
        const complexityLevel = complexity[0];
        if (complexityLevel === 1) {
          predictedY = 50 + (x - 50) * 0.3;
        } else if (complexityLevel === 2) {
          predictedY = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1;
        } else if (complexityLevel === 3) {
          predictedY = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1 + Math.sin(x / 5) * 10;
        } else if (complexityLevel === 4) {
          predictedY = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1 + Math.sin(x / 5) * 10 + Math.sin(x / 2) * 5;
        } else if (complexityLevel === 5) {
          predictedY = 50 + 30 * Math.sin(x / 20) + (x - 50) * 0.1 + Math.sin(x / 5) * 10 + Math.sin(x / 2) * 5 + Math.sin(x / 1) * 3;
        }
        
        ssRes += Math.pow(point.y - predictedY, 2);
        ssTot += Math.pow(point.y - yMean, 2);
      });
      
      return Math.max(0, 1 - (ssRes / ssTot));
    };
    
    return {
      train: Math.round(calculateR2(trainPoints) * 100),
      test: Math.round(calculateR2(testPoints) * 100)
    };
  };

  const performance = calculatePerformance();
  const overfitting = performance.train - performance.test > 15;
  const underfitting = performance.train < 60 && performance.test < 60;

  const getComplexityLabel = (level: number) => {
    switch (level) {
      case 1: return 'Underfitting (Too Simple)';
      case 2: return 'Good Fit (Balanced)';
      case 3: return 'Slight Overfitting';
      case 4: return 'Overfitting (Too Complex)';
      case 5: return 'Severe Overfitting';
      default: return 'Unknown';
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
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Overfitting Playground
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Explore the balance between memorizing and learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Understanding Overfitting:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• <strong>Underfitting:</strong> Model is too simple to capture patterns</li>
            <li>• <strong>Good Fit:</strong> Model learns patterns without memorizing</li>
            <li>• <strong>Overfitting:</strong> Model memorizes training data but fails on new data</li>
            <li>• <strong>Goal:</strong> Find the sweet spot between simplicity and complexity</li>
          </ul>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Model Complexity: {getComplexityLabel(complexity[0])}
            </label>
            <Slider
              value={complexity}
              onValueChange={setComplexity}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Simple</span>
              <span>Balanced</span>
              <span>Complex</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={generateData}
              variant="outline"
              className={`${themeClasses.border}`}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Data
            </Button>
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Model Performance Visualization</h4>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border rounded-lg bg-white dark:bg-gray-900"
            />
            <div className="absolute top-2 right-2 text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={themeClasses.text}>Training Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={themeClasses.text}>Test Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className={themeClasses.text}>Model</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h5 className={`font-semibold ${themeClasses.text}`}>Training Performance</h5>
            </div>
            <div className="text-2xl font-bold text-blue-500">{performance.train}%</div>
            <p className={`text-sm ${themeClasses.text}/70`}>R² Score on training data</p>
          </div>
          
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h5 className={`font-semibold ${themeClasses.text}`}>Test Performance</h5>
            </div>
            <div className="text-2xl font-bold text-red-500">{performance.test}%</div>
            <p className={`text-sm ${themeClasses.text}/70`}>R² Score on test data</p>
          </div>
        </div>

        {/* Analysis */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Analysis</h4>
          <div className="space-y-2 text-sm">
            {underfitting && (
              <div className="flex items-center space-x-2 text-yellow-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Underfitting detected - model is too simple to capture patterns</span>
              </div>
            )}
            {overfitting && (
              <div className="flex items-center space-x-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Overfitting detected - model memorizes training data but fails on test data</span>
              </div>
            )}
            {!underfitting && !overfitting && performance.train > 70 && (
              <div className="flex items-center space-x-2 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span>Good balance - model learns patterns without overfitting</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Insights */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Key Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Generalization:</strong> A good model performs well on both training and test data.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Sweet Spot:</strong> Find the complexity level where test performance is highest.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Overfitting Risk:</strong> High training performance with low test performance indicates overfitting.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Regularization:</strong> Techniques like cross-validation help prevent overfitting.
              </p>
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
              I Understand Overfitting
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Excellent!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You now understand the crucial concept of overfitting vs generalization. 
              This knowledge is essential for building robust machine learning models!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
