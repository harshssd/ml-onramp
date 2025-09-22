'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { ScalingPlaygroundConfig } from '@/types/widget-configs';
import { 
  BarChart3, 
  Settings, 
  CheckCircle, 
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Play,
  Eye
} from 'lucide-react';

interface ScalingPlaygroundWidgetProps {
  onComplete?: () => void;
  config?: ScalingPlaygroundConfig;
}

interface ScalingMethod {
  id: string;
  name: string;
  description: string;
  formula: string;
  pros: string[];
  cons: string[];
  color: string;
}

interface ScalingResult {
  method: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  description: string;
}

export default function ScalingPlaygroundWidget({ 
  onComplete, 
  config
}: ScalingPlaygroundWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [results, setResults] = useState<ScalingResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showDistributions, setShowDistributions] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scalingMethods: ScalingMethod[] = [
    {
      id: 'standard',
      name: 'Standardization',
      description: 'Scale to mean=0, std=1 (Z-score normalization)',
      formula: '(x - μ) / σ',
      pros: ['Preserves distribution shape', 'Good for normal distributions', 'Widely used'],
      cons: ['Sensitive to outliers', 'Assumes normal distribution'],
      color: 'blue'
    },
    {
      id: 'minmax',
      name: 'Min-Max Scaling',
      description: 'Scale to range [0, 1]',
      formula: '(x - min) / (max - min)',
      pros: ['Preserves original distribution', 'Bounded range', 'Good for neural networks'],
      cons: ['Sensitive to outliers', 'Can compress data if outliers present'],
      color: 'green'
    },
    {
      id: 'robust',
      name: 'Robust Scaling',
      description: 'Scale using median and IQR (outlier-resistant)',
      formula: '(x - median) / IQR',
      pros: ['Robust to outliers', 'Good for skewed data', 'Preserves median'],
      cons: ['Less interpretable', 'May not work well for normal data'],
      color: 'purple'
    },
    {
      id: 'log',
      name: 'Log Transform',
      description: 'Apply log transformation to reduce skewness',
      formula: 'log(x + ε)',
      pros: ['Reduces right skew', 'Stabilizes variance', 'Good for multiplicative relationships'],
      cons: ['Only for positive values', 'Can over-correct', 'Less interpretable'],
      color: 'orange'
    }
  ];

  const simulateScaling = (method: string): ScalingResult => {
    // Simulate different performance based on scaling method
    const baseMetrics = {
      standard: { accuracy: 0.85, precision: 0.83, recall: 0.85, f1: 0.84 },
      minmax: { accuracy: 0.84, precision: 0.82, recall: 0.84, f1: 0.83 },
      robust: { accuracy: 0.86, precision: 0.84, recall: 0.86, f1: 0.85 },
      log: { accuracy: 0.87, precision: 0.85, recall: 0.87, f1: 0.86 }
    };

    const methodInfo = scalingMethods.find(m => m.id === method);
    const metrics = baseMetrics[method as keyof typeof baseMetrics] || baseMetrics.standard;

    return {
      method: methodInfo?.name || method,
      ...metrics,
      description: methodInfo?.description || ''
    };
  };

  // Draw distribution comparison
  useEffect(() => {
    if (!showDistributions || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = themeClasses.background;
    ctx.fillRect(0, 0, width, height);

    // Draw distributions for different scaling methods
    const distributions = [
      { name: 'Original', color: '#6b7280', data: generateNormalData(100, 50, 15) },
      { name: 'Standardized', color: '#3b82f6', data: generateNormalData(100, 0, 1) },
      { name: 'Min-Max', color: '#10b981', data: generateNormalData(100, 0.5, 0.2) },
      { name: 'Robust', color: '#8b5cf6', data: generateNormalData(100, 0, 0.5) }
    ];

    // Draw histograms
    distributions.forEach((dist, index) => {
      const x = 50 + index * 200;
      const y = 50;
      const w = 150;
      const h = 200;

      // Draw histogram bars
      ctx.fillStyle = dist.color;
      ctx.globalAlpha = 0.7;
      
      const bins = 20;
      const binWidth = w / bins;
      
      for (let i = 0; i < bins; i++) {
        const binStart = i / bins;
        const binEnd = (i + 1) / bins;
        const count = dist.data.filter(d => d >= binStart && d < binEnd).length;
        const barHeight = (count / dist.data.length) * h;
        
        ctx.fillRect(
          x + i * binWidth,
          y + h - barHeight,
          binWidth - 1,
          barHeight
        );
      }

      // Draw labels
      ctx.fillStyle = themeClasses.text;
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(dist.name, x + w/2, y + h + 20);
    });

    // Draw axes
    ctx.strokeStyle = themeClasses.text;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 250);
    ctx.moveTo(50, 250);
    ctx.lineTo(850, 250);
    ctx.stroke();

  }, [showDistributions, themeClasses.background, themeClasses.text]);

  const generateNormalData = (n: number, mean: number, std: number): number[] => {
    const data = [];
    for (let i = 0; i < n; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      data.push(z0 * std + mean);
    }
    return data;
  };

  const handleRunScaling = async () => {
    if (!selectedMethod) return;

    setIsRunning(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = simulateScaling(selectedMethod);
    setResults(prev => [...prev, result]);
    setIsRunning(false);
  };

  const handleCompareAll = async () => {
    setIsRunning(true);
    
    // Simulate running all methods
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const allResults = methods.map(method => simulateScaling(method));
    setResults(allResults);
    setIsRunning(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setResults([]);
    setSelectedMethod('');
    setCompleted(false);
  };

  const getBestMethod = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) => 
      current.f1 > best.f1 ? current : best
    );
  };

  const bestMethod = getBestMethod();

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          Scaling Playground
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Experiment with different scaling methods and see their impact on data distributions and model performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Select Scaling Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scalingMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedMethod === method.id ? 'bg-blue-500' : 'bg-gray-400'
                    } text-white`}>
                      <Settings className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className={`font-medium ${themeClasses.text}`}>
                        {method.name}
                      </h5>
                      <p className={`text-sm ${themeClasses.text}/70`}>
                        {method.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`text-xs font-mono ${themeClasses.text}/60`}>
                    Formula: {method.formula}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {method.pros.slice(0, 2).map((pro, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                        {pro}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold ${themeClasses.text}`}>Distribution Comparison</h4>
            <Button
              onClick={() => setShowDistributions(!showDistributions)}
              variant="outline"
              size="sm"
              className={themeClasses.border}
            >
              <Eye className="h-4 w-4 mr-1" />
              {showDistributions ? 'Hide' : 'Show'} Distributions
            </Button>
          </div>
          
          {showDistributions && (
            <div className="border rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={900}
                height={300}
                className="w-full border rounded"
              />
              <p className={`text-xs ${themeClasses.text}/70 text-center mt-2`}>
                Comparison of data distributions before and after different scaling methods
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex space-x-3">
          <Button
            onClick={handleRunScaling}
            disabled={!selectedMethod || isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test Method
              </>
            )}
          </Button>
          
          <Button
            onClick={handleCompareAll}
            disabled={isRunning}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare All
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className={themeClasses.border}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Performance Results</h4>
            
            {/* Best Method Highlight */}
            {bestMethod && (
              <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className={`font-semibold ${themeClasses.text}`}>
                    Best Method: {bestMethod.method}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Accuracy</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestMethod.accuracy.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Precision</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestMethod.precision.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Recall</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestMethod.recall.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>F1 Score</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestMethod.f1.toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`border-b ${themeClasses.border}`}>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Method</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Accuracy</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Precision</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Recall</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>F1 Score</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .sort((a, b) => b.f1 - a.f1)
                    .map((result, index) => (
                    <tr key={index} className={`border-b ${themeClasses.border}`}>
                      <td className={`p-2 font-medium ${themeClasses.text}`}>
                        {result.method}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.accuracy.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.precision.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.recall.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.f1.toFixed(3)}
                      </td>
                      <td className="p-2">
                        <Badge className={
                          index === 0 ? 'bg-green-500 text-white' :
                          index === 1 ? 'bg-yellow-500 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-500 text-white'
                        }>
                          #{index + 1}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Key Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Distance-based models</strong> (KNN, SVM) are most sensitive to scaling.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Robust scaling</strong> works well when outliers are present.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Log transform</strong> is great for right-skewed data.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Tree-based models</strong> are usually not affected by scaling.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Scaling Playground Complete!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully compared different scaling methods and learned which works best for your data and models.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
