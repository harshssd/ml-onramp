'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { TrendingDown, Target, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface ErrorVisualizerWidgetProps {
  onComplete?: () => void;
}

interface DataPoint {
  x: number;
  y: number;
  predicted: number;
  error: number;
}

export default function ErrorVisualizerWidget({ onComplete }: ErrorVisualizerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [learningRate, setLearningRate] = useState([0.1]);
  const [iterations, setIterations] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [currentLoss, setCurrentLoss] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate sample data
  const generateData = () => {
    const points: DataPoint[] = [];
    for (let i = 0; i < 20; i++) {
      const x = i * 5;
      const y = 2 * x + 10 + (Math.random() - 0.5) * 20; // y = 2x + 10 + noise
      points.push({
        x,
        y,
        predicted: 0,
        error: 0
      });
    }
    setDataPoints(points);
  };

  useEffect(() => {
    generateData();
  }, []);

  // Simple linear regression training
  const trainModel = async () => {
    if (dataPoints.length === 0) return;
    
    setIsTraining(true);
    setIterations(0);
    setLossHistory([]);
    
    let slope = 0;
    let intercept = 0;
    const lr = learningRate[0];
    
    for (let epoch = 0; epoch < 50; epoch++) {
      // Calculate predictions
      const newDataPoints = dataPoints.map(point => {
        const predicted = slope * point.x + intercept;
        const error = point.y - predicted;
        return { ...point, predicted, error };
      });
      
      setDataPoints(newDataPoints);
      
      // Calculate loss (Mean Squared Error)
      const mse = newDataPoints.reduce((sum, point) => sum + point.error * point.error, 0) / newDataPoints.length;
      setCurrentLoss(mse);
      setLossHistory(prev => [...prev, mse]);
      
      // Update parameters using gradient descent
      const gradientSlope = newDataPoints.reduce((sum, point) => sum + point.error * point.x, 0) / newDataPoints.length;
      const gradientIntercept = newDataPoints.reduce((sum, point) => sum + point.error, 0) / newDataPoints.length;
      
      slope += lr * gradientSlope;
      intercept += lr * gradientIntercept;
      
      setIterations(epoch + 1);
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsTraining(false);
  };

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
    
    if (dataPoints.length === 0) return;
    
    // Find min/max values
    const allY = dataPoints.map(p => [p.y, p.predicted]).flat();
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minX = Math.min(...dataPoints.map(p => p.x));
    const maxX = Math.max(...dataPoints.map(p => p.x));
    
    // Scale factors
    const scaleX = (width - 40) / (maxX - minX);
    const scaleY = (height - 40) / (maxY - minY);
    
    const xToCanvas = (x: number) => 20 + (x - minX) * scaleX;
    const yToCanvas = (y: number) => height - 20 - (y - minY) * scaleY;
    
    // Draw grid
    ctx.strokeStyle = themeClasses.border;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = 20 + (i / 10) * (width - 40);
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const y = 20 + (i / 10) * (height - 40);
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }
    
    // Draw data points
    dataPoints.forEach(point => {
      // Actual point
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(xToCanvas(point.x), yToCanvas(point.y), 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Predicted point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(xToCanvas(point.x), yToCanvas(point.predicted), 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Error line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xToCanvas(point.x), yToCanvas(point.y));
      ctx.lineTo(xToCanvas(point.x), yToCanvas(point.predicted));
      ctx.stroke();
    });
    
    // Draw regression line
    if (dataPoints.some(p => p.predicted !== 0)) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(xToCanvas(minX), yToCanvas(dataPoints[0].predicted));
      ctx.lineTo(xToCanvas(maxX), yToCanvas(dataPoints[dataPoints.length - 1].predicted));
      ctx.stroke();
    }
    
  }, [dataPoints, themeClasses.background, themeClasses.border]);

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
          <TrendingDown className="h-5 w-5 mr-2 text-blue-500" />
          Error Visualization
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Watch how models learn by reducing error through feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Learning Rate: {learningRate[0]}
            </label>
            <Slider
              value={learningRate}
              onValueChange={setLearningRate}
              max={0.5}
              min={0.01}
              step={0.01}
              className="w-full"
              disabled={isTraining}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.01</span>
              <span>0.25</span>
              <span>0.5</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={trainModel}
              disabled={isTraining}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isTraining ? 'Training...' : 'Start Training'}
            </Button>
            <Button
              onClick={generateData}
              variant="outline"
              className={`${themeClasses.border}`}
              disabled={isTraining}
            >
              New Data
            </Button>
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Model Learning Visualization</h4>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="border rounded-lg bg-white dark:bg-gray-900"
            />
            <div className="absolute top-2 left-2 text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={themeClasses.text}>Actual</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={themeClasses.text}>Predicted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-yellow-500"></div>
                <span className={themeClasses.text}>Error</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className={themeClasses.text}>Model Line</span>
              </div>
            </div>
          </div>
        </div>

        {/* Training Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Current Loss</h5>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {currentLoss.toFixed(2)}
            </div>
            <p className={`text-sm ${themeClasses.text}/70`}>
              Mean Squared Error
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-green-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Iterations</h5>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {iterations}
            </div>
            <p className={`text-sm ${themeClasses.text}/70`}>
              Training steps
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5 text-purple-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Improvement</h5>
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {lossHistory.length > 1 ? 
                Math.round(((lossHistory[0] - currentLoss) / lossHistory[0]) * 100) : 0}%
            </div>
            <p className={`text-sm ${themeClasses.text}/70`}>
              Loss reduction
            </p>
          </div>
        </div>

        {/* Loss Curve */}
        {lossHistory.length > 1 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Loss Curve</h4>
            <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <svg width="100%" height="100%" className="overflow-visible">
                {lossHistory.map((loss, index) => {
                  if (index === 0) return null;
                  const x1 = ((index - 1) / (lossHistory.length - 1)) * 100;
                  const x2 = (index / (lossHistory.length - 1)) * 100;
                  const y1 = 100 - (lossHistory[index - 1] / Math.max(...lossHistory)) * 100;
                  const y2 = 100 - (loss / Math.max(...lossHistory)) * 100;
                  
                  return (
                    <line
                      key={index}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Key Concepts */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>How Learning Works</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Error Measurement:</strong> The model calculates how wrong its predictions are.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Gradient Descent:</strong> The model adjusts parameters to reduce error.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Learning Rate:</strong> Controls how big steps the model takes toward the solution.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Iterative Improvement:</strong> The model gets better with each training step.
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
              I Understand How Models Learn
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Perfect!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You now understand how machines learn through error reduction. 
              This is the foundation of all machine learning!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
