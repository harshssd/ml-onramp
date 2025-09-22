'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { Brain, Target, CheckCircle, RotateCcw, Zap, TreePine, Users, Circle, Square } from 'lucide-react';

interface AlgorithmExplorerWidgetProps {
  onComplete?: () => void;
  data?: string[];
}

interface DataPoint {
  x: number;
  y: number;
  label: string;
  predicted?: string;
}

type AlgorithmType = 'Decision Tree' | 'Random Forest' | 'SVM' | 'KNN';

export default function AlgorithmExplorerWidget({ onComplete, data = ["Decision Tree","Random Forest","SVM","KNN"] }: AlgorithmExplorerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('Decision Tree');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Algorithm-specific parameters
  const [kValue, setKValue] = useState([3]);
  const [marginWidth, setMarginWidth] = useState([1]);
  const [treeCount, setTreeCount] = useState([5]);

  const colors = {
    'Class A': '#3b82f6',
    'Class B': '#ef4444',
    'Class C': '#10b981',
    'Class D': '#8b5cf6'
  };

  // Generate sample data
  const generateData = () => {
    const points: DataPoint[] = [];
    
    // Generate 2D data with clear decision boundaries
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      let label = 'Class A';
      if (x > 60 && y > 60) {
        label = 'Class B';
      } else if (x < 40 && y < 40) {
        label = 'Class C';
      } else if (x > 70 && y < 30) {
        label = 'Class D';
      }
      
      points.push({ x, y, label });
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
    
    // Draw decision boundary based on algorithm
    drawDecisionBoundary(ctx, width, height);
    
    // Draw data points
    dataPoints.forEach(point => {
      const x = (point.x / 100) * width;
      const y = (point.y / 100) * height;
      
      ctx.fillStyle = colors[point.label as keyof typeof colors] || '#666';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = themeClasses.background;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
  }, [dataPoints, selectedAlgorithm, kValue, marginWidth, treeCount, themeClasses.background, themeClasses.border]);

  const drawDecisionBoundary = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    
    switch (selectedAlgorithm) {
      case 'Decision Tree':
        // Draw rectangular decision boundaries
        ctx.beginPath();
        ctx.rect(0, 0, width * 0.4, height * 0.4); // Class C
        ctx.rect(width * 0.6, height * 0.6, width * 0.4, height * 0.4); // Class B
        ctx.rect(width * 0.7, 0, width * 0.3, height * 0.3); // Class D
        ctx.stroke();
        break;
        
      case 'Random Forest':
        // Draw multiple overlapping boundaries (simplified)
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < treeCount[0]; i++) {
          ctx.beginPath();
          const offset = (i - treeCount[0] / 2) * 10;
          ctx.rect(offset, offset, width * 0.4, height * 0.4);
          ctx.rect(width * 0.6 + offset, height * 0.6 + offset, width * 0.4, height * 0.4);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        break;
        
      case 'SVM':
        // Draw curved boundary with margin
        ctx.beginPath();
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw margin
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + marginWidth[0] * 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.arc(centerX, centerY, radius - marginWidth[0] * 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
        break;
        
      case 'KNN':
        // Draw Voronoi-like cells (simplified)
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, 0);
        ctx.lineTo(width * 0.5, height);
        ctx.moveTo(0, height * 0.5);
        ctx.lineTo(width, height * 0.5);
        ctx.stroke();
        break;
    }
  };

  const trainModel = async () => {
    setIsTraining(true);
    
    // Simulate training
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate accuracy based on algorithm
    let correct = 0;
    dataPoints.forEach(point => {
      let predicted = 'Class A';
      
      switch (selectedAlgorithm) {
        case 'Decision Tree':
        case 'Random Forest':
          if (point.x > 60 && point.y > 60) predicted = 'Class B';
          else if (point.x < 40 && point.y < 40) predicted = 'Class C';
          else if (point.x > 70 && point.y < 30) predicted = 'Class D';
          break;
          
        case 'SVM':
          const centerX = 50;
          const centerY = 50;
          const distance = Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2));
          if (distance < 30) predicted = 'Class A';
          else if (point.x > 60 && point.y > 60) predicted = 'Class B';
          else if (point.x < 40 && point.y < 40) predicted = 'Class C';
          else predicted = 'Class D';
          break;
          
        case 'KNN':
          // Simple KNN simulation
          const neighbors = dataPoints
            .filter(p => p !== point)
            .map(p => ({
              point: p,
              distance: Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2))
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, kValue[0]);
          
          const classCounts: { [key: string]: number } = {};
          neighbors.forEach(n => {
            classCounts[n.point.label] = (classCounts[n.point.label] || 0) + 1;
          });
          
          predicted = Object.keys(classCounts).reduce((a, b) => 
            classCounts[a] > classCounts[b] ? a : b
          );
          break;
      }
      
      if (predicted === point.label) correct++;
    });
    
    setAccuracy(Math.round((correct / dataPoints.length) * 100));
    setIsTraining(false);
  };

  const getAlgorithmIcon = (algorithm: AlgorithmType) => {
    switch (algorithm) {
      case 'Decision Tree': return <TreePine className="h-4 w-4" />;
      case 'Random Forest': return <Users className="h-4 w-4" />;
      case 'SVM': return <Circle className="h-4 w-4" />;
      case 'KNN': return <Square className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getAlgorithmDescription = (algorithm: AlgorithmType) => {
    switch (algorithm) {
      case 'Decision Tree':
        return 'Splits data using feature thresholds to create interpretable rules';
      case 'Random Forest':
        return 'Combines multiple decision trees to reduce overfitting';
      case 'SVM':
        return 'Finds optimal hyperplane to separate classes with maximum margin';
      case 'KNN':
        return 'Predicts based on the k nearest neighbors in feature space';
      default:
        return '';
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
          <Brain className="h-5 w-5 mr-2 text-blue-500" />
          Algorithm Explorer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Compare different machine learning algorithms and see how they work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Choose an Algorithm</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.map(algorithm => (
              <Button
                key={algorithm}
                variant={selectedAlgorithm === algorithm ? "default" : "outline"}
                onClick={() => setSelectedAlgorithm(algorithm as AlgorithmType)}
                className={`flex items-center space-x-2 ${
                  selectedAlgorithm === algorithm 
                    ? 'bg-blue-500 text-white' 
                    : themeClasses.border
                }`}
              >
                {getAlgorithmIcon(algorithm as AlgorithmType)}
                <span className="text-sm">{algorithm}</span>
              </Button>
            ))}
          </div>
          
          <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <p className={`text-sm ${themeClasses.text}/80`}>
              <strong>{selectedAlgorithm}:</strong> {getAlgorithmDescription(selectedAlgorithm)}
            </p>
          </div>
        </div>

        {/* Algorithm-specific Parameters */}
        {selectedAlgorithm === 'KNN' && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>KNN Parameters</h4>
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                K Value: {kValue[0]}
              </label>
              <Slider
                value={kValue}
                onValueChange={setKValue}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        )}

        {selectedAlgorithm === 'SVM' && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>SVM Parameters</h4>
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Margin Width: {marginWidth[0]}
              </label>
              <Slider
                value={marginWidth}
                onValueChange={setMarginWidth}
                max={3}
                min={0.5}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>
        )}

        {selectedAlgorithm === 'Random Forest' && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Random Forest Parameters</h4>
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Number of Trees: {treeCount[0]}
              </label>
              <Slider
                value={treeCount}
                onValueChange={setTreeCount}
                max={10}
                min={3}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-4">
          <Button
            onClick={trainModel}
            disabled={isTraining}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isTraining ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Train Model
              </>
            )}
          </Button>
          <Button
            onClick={generateData}
            variant="outline"
            className={`${themeClasses.border}`}
            disabled={isTraining}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            New Data
          </Button>
        </div>

        {/* Visualization */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Algorithm Visualization</h4>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={500}
              height={400}
              className="border rounded-lg bg-white dark:bg-gray-900"
            />
            <div className="absolute top-2 right-2 text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={themeClasses.text}>Class A</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={themeClasses.text}>Class B</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={themeClasses.text}>Class C</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className={themeClasses.text}>Class D</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {accuracy > 0 && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Model Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{accuracy}%</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{selectedAlgorithm}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Algorithm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{dataPoints.length}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Data Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Comparison */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Algorithm Characteristics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Strengths:</h5>
              <ul className={`space-y-1 ${themeClasses.text}/80`}>
                {selectedAlgorithm === 'Decision Tree' && (
                  <>
                    <li>• Highly interpretable</li>
                    <li>• Handles mixed data types</li>
                    <li>• No feature scaling needed</li>
                  </>
                )}
                {selectedAlgorithm === 'Random Forest' && (
                  <>
                    <li>• Reduces overfitting</li>
                    <li>• Handles missing data well</li>
                    <li>• Feature importance ranking</li>
                  </>
                )}
                {selectedAlgorithm === 'SVM' && (
                  <>
                    <li>• Effective in high dimensions</li>
                    <li>• Memory efficient</li>
                    <li>• Works well with small datasets</li>
                  </>
                )}
                {selectedAlgorithm === 'KNN' && (
                  <>
                    <li>• Simple to understand</li>
                    <li>• No training phase</li>
                    <li>• Works well with non-linear data</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Weaknesses:</h5>
              <ul className={`space-y-1 ${themeClasses.text}/80`}>
                {selectedAlgorithm === 'Decision Tree' && (
                  <>
                    <li>• Prone to overfitting</li>
                    <li>• Unstable with small changes</li>
                    <li>• Biased towards dominant class</li>
                  </>
                )}
                {selectedAlgorithm === 'Random Forest' && (
                  <>
                    <li>• Less interpretable</li>
                    <li>• Can be slow for large datasets</li>
                    <li>• Memory intensive</li>
                  </>
                )}
                {selectedAlgorithm === 'SVM' && (
                  <>
                    <li>• Poor performance on large datasets</li>
                    <li>• Sensitive to feature scaling</li>
                    <li>• No probabilistic output</li>
                  </>
                )}
                {selectedAlgorithm === 'KNN' && (
                  <>
                    <li>• Computationally expensive</li>
                    <li>• Sensitive to irrelevant features</li>
                    <li>• Poor performance on high-dimensional data</li>
                  </>
                )}
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
              I Understand ML Algorithms
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Fantastic!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've explored the key machine learning algorithms! Understanding when to use each 
              algorithm is crucial for building effective AI systems.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
