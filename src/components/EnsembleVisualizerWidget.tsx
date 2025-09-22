'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Target, CheckCircle, RotateCcw, Brain, Zap, TrendingUp, BarChart3 } from 'lucide-react';

interface EnsembleVisualizerWidgetProps {
  onComplete?: () => void;
  data?: string[];
}

interface DataPoint {
  x: number;
  y: number;
  label: string;
  predicted?: string;
}

interface Model {
  id: string;
  type: 'weak' | 'bagging' | 'boosting' | 'stacking';
  accuracy: number;
  predictions: string[];
}

type EnsembleType = 'Weak Learners' | 'Bagging' | 'Boosting';

export default function EnsembleVisualizerWidget({ onComplete, data = ["Weak Learners","Bagging","Boosting"] }: EnsembleVisualizerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedMethod, setSelectedMethod] = useState<EnsembleType>('Weak Learners');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [ensembleAccuracy, setEnsembleAccuracy] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [numModels, setNumModels] = useState([5]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    for (let i = 0; i < 40; i++) {
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

  // Generate weak learners
  const generateWeakLearners = (): Model[] => {
    const weakModels: Model[] = [];
    
    for (let i = 0; i < numModels[0]; i++) {
      const predictions = dataPoints.map(point => {
        // Weak learner: random predictions with some bias
        const random = Math.random();
        if (random < 0.3) return 'Class A';
        if (random < 0.6) return 'Class B';
        if (random < 0.8) return 'Class C';
        return 'Class D';
      });
      
      const correct = predictions.filter((pred, idx) => pred === dataPoints[idx].label).length;
      const accuracy = (correct / dataPoints.length) * 100;
      
      weakModels.push({
        id: `weak-${i}`,
        type: 'weak',
        accuracy: Math.round(accuracy),
        predictions
      });
    }
    
    return weakModels;
  };

  // Apply bagging
  const applyBagging = (weakModels: Model[]): Model[] => {
    const baggedModels: Model[] = [];
    
    for (let i = 0; i < numModels[0]; i++) {
      // Bootstrap sample (with replacement)
      const sampleIndices = Array.from({ length: dataPoints.length }, () => 
        Math.floor(Math.random() * dataPoints.length)
      );
      const sample = sampleIndices.map(idx => dataPoints[idx]);
      
      // Train on sample (simplified)
      const predictions = dataPoints.map(point => {
        const random = Math.random();
        if (random < 0.4) return 'Class A';
        if (random < 0.7) return 'Class B';
        if (random < 0.85) return 'Class C';
        return 'Class D';
      });
      
      const correct = predictions.filter((pred, idx) => pred === dataPoints[idx].label).length;
      const accuracy = (correct / dataPoints.length) * 100;
      
      baggedModels.push({
        id: `bagged-${i}`,
        type: 'bagging',
        accuracy: Math.round(accuracy),
        predictions
      });
    }
    
    return baggedModels;
  };

  // Apply boosting
  const applyBoosting = (): Model[] => {
    const boostedModels: Model[] = [];
    let weights = new Array(dataPoints.length).fill(1);
    
    for (let i = 0; i < numModels[0]; i++) {
      // Focus on misclassified points (simplified)
      const predictions = dataPoints.map((point, idx) => {
        const random = Math.random();
        const weight = weights[idx];
        
        // Higher weight = more likely to be correct
        if (random < 0.3 + weight * 0.2) return 'Class A';
        if (random < 0.6 + weight * 0.1) return 'Class B';
        if (random < 0.8 + weight * 0.1) return 'Class C';
        return 'Class D';
      });
      
      const correct = predictions.filter((pred, idx) => pred === dataPoints[idx].label).length;
      const accuracy = (correct / dataPoints.length) * 100;
      
      // Update weights (increase for misclassified)
      weights = weights.map((weight, idx) => 
        predictions[idx] === dataPoints[idx].label ? weight : weight * 1.5
      );
      
      boostedModels.push({
        id: `boosted-${i}`,
        type: 'boosting',
        accuracy: Math.round(accuracy),
        predictions
      });
    }
    
    return boostedModels;
  };

  const trainEnsemble = async () => {
    setIsTraining(true);
    
    // Simulate training process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let trainedModels: Model[] = [];
    
    switch (selectedMethod) {
      case 'Weak Learners':
        trainedModels = generateWeakLearners();
        break;
      case 'Bagging':
        const weakModels = generateWeakLearners();
        trainedModels = applyBagging(weakModels);
        break;
      case 'Boosting':
        trainedModels = applyBoosting();
        break;
    }
    
    setModels(trainedModels);
    
    // Calculate ensemble accuracy (majority vote)
    const ensemblePredictions = dataPoints.map((_, idx) => {
      const votes: { [key: string]: number } = {};
      trainedModels.forEach(model => {
        const prediction = model.predictions[idx];
        votes[prediction] = (votes[prediction] || 0) + 1;
      });
      
      return Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
    });
    
    const correct = ensemblePredictions.filter((pred, idx) => pred === dataPoints[idx].label).length;
    setEnsembleAccuracy(Math.round((correct / dataPoints.length) * 100));
    
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
    
  }, [dataPoints, themeClasses.background, themeClasses.border]);

  const getMethodIcon = (method: EnsembleType) => {
    switch (method) {
      case 'Weak Learners': return <Brain className="h-4 w-4" />;
      case 'Bagging': return <Users className="h-4 w-4" />;
      case 'Boosting': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getMethodDescription = (method: EnsembleType) => {
    switch (method) {
      case 'Weak Learners':
        return 'Individual models with poor performance';
      case 'Bagging':
        return 'Bootstrap aggregating - train on different data subsets';
      case 'Boosting':
        return 'Sequential training - each model fixes previous errors';
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
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Ensemble Visualizer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          See how combining weak models creates strong predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Choose Ensemble Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {data.map(method => (
              <Button
                key={method}
                variant={selectedMethod === method ? "default" : "outline"}
                onClick={() => setSelectedMethod(method as EnsembleType)}
                className={`flex items-center space-x-2 ${
                  selectedMethod === method 
                    ? 'bg-blue-500 text-white' 
                    : themeClasses.border
                }`}
              >
                {getMethodIcon(method as EnsembleType)}
                <span className="text-sm">{method}</span>
              </Button>
            ))}
          </div>
          
          <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <p className={`text-sm ${themeClasses.text}/80`}>
              <strong>{selectedMethod}:</strong> {getMethodDescription(selectedMethod)}
            </p>
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Parameters</h4>
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Number of Models: {numModels[0]}
            </label>
            <Slider
              value={numModels}
              onValueChange={setNumModels}
              max={10}
              min={3}
              step={1}
              className="w-full"
              disabled={isTraining}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          <Button
            onClick={trainEnsemble}
            disabled={isTraining}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isTraining ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Training Ensemble...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Train Ensemble
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
          <h4 className={`font-semibold ${themeClasses.text}`}>Data Visualization</h4>
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

        {/* Model Performance */}
        {models.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Individual Model Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {models.map((model, index) => (
                <div
                  key={model.id}
                  className={`p-2 rounded text-center text-xs ${
                    model.accuracy < 30 ? 'bg-red-100 text-red-800' :
                    model.accuracy < 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}
                >
                  <div className="font-semibold">Model {index + 1}</div>
                  <div>{model.accuracy}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ensemble Performance */}
        {ensembleAccuracy > 0 && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Ensemble Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{ensembleAccuracy}%</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Ensemble Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{selectedMethod}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Method</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{numModels[0]}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Models</div>
              </div>
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
                <strong>Weak Learners:</strong> Individual models often perform poorly due to high variance or bias.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Bagging:</strong> Reduces variance by averaging predictions from models trained on different data subsets.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Boosting:</strong> Reduces bias by focusing each new model on the mistakes of previous models.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Ensemble Effect:</strong> Combining multiple models often outperforms any single model.
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
              I Understand Ensemble Methods
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
              You now understand how ensemble methods work! This powerful technique 
              is used in many winning machine learning competitions and production systems.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
