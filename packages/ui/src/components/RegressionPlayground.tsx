'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface RegressionPlaygroundProps {
  className?: string;
}

interface DataPoint {
  x: number;
  y: number;
}

export function RegressionPlayground({ className }: RegressionPlaygroundProps) {
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(100);
  const [isTraining, setIsTraining] = useState(false);
  const [weights, setWeights] = useState({ w0: 0, w1: 0 });
  const [loss, setLoss] = useState(0);

  // Sample data points
  const dataPoints: DataPoint[] = [
    { x: 1, y: 2.1 },
    { x: 2, y: 3.9 },
    { x: 3, y: 6.1 },
    { x: 4, y: 7.8 },
    { x: 5, y: 10.2 },
    { x: 6, y: 12.1 },
    { x: 7, y: 14.3 },
    { x: 8, y: 16.2 },
  ];

  // Generate prediction line points
  const predictionLine = useMemo(() => {
    const points: DataPoint[] = [];
    for (let x = 0; x <= 10; x += 0.1) {
      const y = weights.w0 + weights.w1 * x;
      points.push({ x, y });
    }
    return points;
  }, [weights]);

  // Calculate loss (Mean Squared Error)
  const calculateLoss = (w0: number, w1: number) => {
    let totalLoss = 0;
    dataPoints.forEach(({ x, y }) => {
      const predicted = w0 + w1 * x;
      totalLoss += Math.pow(y - predicted, 2);
    });
    return totalLoss / dataPoints.length;
  };

  // Gradient descent training
  const trainModel = async () => {
    setIsTraining(true);
    let w0 = 0;
    let w1 = 0;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let dw0 = 0;
      let dw1 = 0;
      
      // Calculate gradients
      dataPoints.forEach(({ x, y }) => {
        const predicted = w0 + w1 * x;
        const error = y - predicted;
        dw0 += error;
        dw1 += error * x;
      });
      
      // Update weights
      w0 += learningRate * (dw0 / dataPoints.length);
      w1 += learningRate * (dw1 / dataPoints.length);
      
      // Update state every 10 epochs for visualization
      if (epoch % 10 === 0) {
        setWeights({ w0, w1 });
        setLoss(calculateLoss(w0, w1));
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for animation
      }
    }
    
    setWeights({ w0, w1 });
    setLoss(calculateLoss(w0, w1));
    setIsTraining(false);
  };

  const resetModel = () => {
    setWeights({ w0: 0, w1: 0 });
    setLoss(calculateLoss(0, 0));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Linear Regression Playground</CardTitle>
        <CardDescription>
          Adjust the parameters and watch the model learn to fit the data points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="learning-rate">Learning Rate: {learningRate}</Label>
            <input
              id="learning-rate"
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="epochs">Epochs: {epochs}</Label>
            <input
              id="epochs"
              type="range"
              min="10"
              max="500"
              step="10"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Model Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium">Weight (w0):</div>
            <div className="text-lg font-mono">{weights.w0.toFixed(4)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium">Weight (w1):</div>
            <div className="text-lg font-mono">{weights.w1.toFixed(4)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium">Loss (MSE):</div>
            <div className="text-lg font-mono">{loss.toFixed(4)}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={trainModel} 
            disabled={isTraining}
            className="flex-1"
          >
            {isTraining ? 'Training...' : 'Train Model'}
          </Button>
          <Button onClick={resetModel} variant="outline">
            Reset
          </Button>
        </div>

        {/* Visualization */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">
            Data Points (blue) vs Predicted Line (red)
          </div>
          <div className="relative h-64 w-full">
            <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Prediction line */}
              <polyline
                points={predictionLine.map(p => `${p.x * 40},${200 - p.y * 10}`).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
              
              {/* Data points */}
              {dataPoints.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x * 40}
                  cy={200 - point.y * 10}
                  r="4"
                  fill="#3b82f6"
                />
              ))}
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
