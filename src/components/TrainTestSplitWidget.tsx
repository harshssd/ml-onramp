'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { Scissors, BarChart3, Target, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface TrainTestSplitWidgetProps {
  onComplete?: () => void;
}

interface DataPoint {
  id: number;
  x: number;
  y: number;
  type: 'train' | 'test';
}

export default function TrainTestSplitWidget({ onComplete }: TrainTestSplitWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  // Fix template literal parsing issue
  const cardBgClass = themeClasses.card.replace('/10', '/5');
  
  const [trainRatio, setTrainRatio] = useState([70]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Generate sample data points
  const generateData = () => {
    const points: DataPoint[] = [];
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 100;
      const y = 2 * x + 10 + (Math.random() - 0.5) * 20; // y = 2x + 10 + noise
      points.push({
        id: i,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        type: 'train'
      });
    }
    setDataPoints(points);
  };

  useEffect(() => {
    generateData();
  }, []);

  useEffect(() => {
    // Split data based on train ratio
    const splitIndex = Math.floor((dataPoints.length * trainRatio[0]) / 100);
    const newData = dataPoints.map((point, index) => ({
      ...point,
      type: index < splitIndex ? 'train' : 'test' as 'train' | 'test'
    }));
    setDataPoints(newData);
  }, [trainRatio, dataPoints.length]);

  const trainData = dataPoints.filter(p => p.type === 'train');
  const testData = dataPoints.filter(p => p.type === 'test');

  const calculateModelPerformance = () => {
    if (trainData.length === 0 || testData.length === 0) return { train: 0, test: 0 };
    
    // Simple linear regression on training data
    const n = trainData.length;
    const sumX = trainData.reduce((sum, p) => sum + p.x, 0);
    const sumY = trainData.reduce((sum, p) => sum + p.y, 0);
    const sumXY = trainData.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = trainData.reduce((sum, p) => sum + p.x * p.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R² for both train and test
    const calculateR2 = (data: DataPoint[]) => {
      const yMean = data.reduce((sum, p) => sum + p.y, 0) / data.length;
      const ssRes = data.reduce((sum, p) => {
        const predicted = slope * p.x + intercept;
        return sum + Math.pow(p.y - predicted, 2);
      }, 0);
      const ssTot = data.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
      return Math.max(0, 1 - (ssRes / ssTot));
    };
    
    return {
      train: Math.round(calculateR2(trainData) * 100),
      test: Math.round(calculateR2(testData) * 100)
    };
  };

  const performance = calculateModelPerformance();
  const overfitting = performance.train - performance.test > 10;

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
          <Scissors className="h-5 w-5 mr-2 text-blue-500" />
          Train/Test Split Explorer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Learn why we split data and how it affects model performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Training Data Ratio: {trainRatio[0]}%
            </label>
            <Slider
              value={trainRatio}
              onValueChange={setTrainRatio}
              max={90}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
              <span>90%</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => setShowResults(!showResults)}
              variant="outline"
              className={`${themeClasses.border}`}
            >
              {showResults ? 'Hide' : 'Show'} Performance
            </Button>
            <Button
              onClick={generateData}
              variant="outline"
              className={`${themeClasses.border}`}
            >
              Generate New Data
            </Button>
          </div>
        </div>

        {/* Data Visualization */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Data Split Visualization</h4>
          <div className="relative h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="absolute inset-4">
              <svg width="100%" height="100%" className="overflow-visible">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(x => (
                  <line
                    key={`v-${x}`}
                    x1={`${x}%`}
                    y1="0%"
                    x2={`${x}%`}
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-gray-300 dark:text-gray-600"
                  />
                ))}
                {[0, 25, 50, 75, 100].map(y => (
                  <line
                    key={`h-${y}`}
                    x1="0%"
                    y1={`${y}%`}
                    x2="100%"
                    y2={`${y}%`}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-gray-300 dark:text-gray-600"
                  />
                ))}
                
                {/* Data points */}
                {dataPoints.map(point => (
                  <circle
                    key={point.id}
                    cx={`${point.x}%`}
                    cy={`${100 - (point.y / 300) * 100}%`}
                    r="3"
                    fill={point.type === 'train' ? '#3b82f6' : '#ef4444'}
                    className="hover:r-4 transition-all"
                  />
                ))}
                
                {/* Split line */}
                <line
                  x1={`${trainRatio[0]}%`}
                  y1="0%"
                  x2={`${trainRatio[0]}%`}
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="text-yellow-500"
                />
              </svg>
            </div>
            
            {/* Legend */}
            <div className="absolute top-2 right-2 flex space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={themeClasses.text}>Training ({trainData.length})</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={themeClasses.text}>Testing ({testData.length})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Results */}
        {showResults && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Model Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${cardBgClass} border ${themeClasses.border}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <h5 className={`font-semibold ${themeClasses.text}`}>Training Performance</h5>
                </div>
                <div className="text-2xl font-bold text-blue-500">{performance.train}%</div>
                <p className={`text-sm ${themeClasses.text}/70`}>
                  R² Score on training data
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${cardBgClass} border ${themeClasses.border}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-red-500" />
                  <h5 className={`font-semibold ${themeClasses.text}`}>Testing Performance</h5>
                </div>
                <div className="text-2xl font-bold text-red-500">{performance.test}%</div>
                <p className={`text-sm ${themeClasses.text}/70`}>
                  R² Score on testing data
                </p>
              </div>
            </div>

            {/* Overfitting Warning */}
            {overfitting && (
              <div className={`p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800`}>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h5 className={`font-semibold ${themeClasses.text}`}>Overfitting Detected!</h5>
                </div>
                <p className={`text-sm ${themeClasses.text}/80`}>
                  The model performs much better on training data than test data. 
                  This suggests it's memorizing rather than learning general patterns.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Key Concepts */}
        <div className={`p-4 rounded-lg ${cardBgClass} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Why Split Data?</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Training Data:</strong> Used to teach the model patterns and relationships.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Testing Data:</strong> Used to evaluate how well the model generalizes to new data.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Fair Evaluation:</strong> Testing on unseen data gives honest performance estimates.
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
              I Understand Train/Test Split
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
              You now understand why we split data and how it helps us build better models. 
              This is a fundamental concept in machine learning!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
