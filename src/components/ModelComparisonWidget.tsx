'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { ModelComparisonConfig } from '@/types/widget-configs';
import { 
  BarChart3, 
  Clock, 
  Brain, 
  Zap, 
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface ModelComparisonWidgetProps {
  onComplete?: () => void;
  config?: ModelComparisonConfig;
}

interface ModelResult {
  name: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  trainingTime: number;
  inferenceTime: number;
  interpretability: number;
  memoryUsage: number;
}

export default function ModelComparisonWidget({ 
  onComplete, 
  config
}: ModelComparisonWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [results, setResults] = useState<ModelResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  const [sortBy, setSortBy] = useState('accuracy');
  const [completed, setCompleted] = useState(false);

  // Simulate model training and evaluation
  const simulateModelTraining = async () => {
    setIsRunning(true);
    
    // Simulate different performance characteristics
    const modelResults: ModelResult[] = [
      {
        name: 'Logistic Regression',
        type: 'linear',
        accuracy: 0.78,
        precision: 0.76,
        recall: 0.78,
        f1: 0.77,
        auc: 0.82,
        trainingTime: 0.1,
        inferenceTime: 0.001,
        interpretability: 0.95,
        memoryUsage: 0.1
      },
      {
        name: 'Random Forest',
        type: 'tree',
        accuracy: 0.82,
        precision: 0.80,
        recall: 0.82,
        f1: 0.81,
        auc: 0.85,
        trainingTime: 1.0,
        inferenceTime: 0.01,
        interpretability: 0.70,
        memoryUsage: 1.0
      },
      {
        name: 'Gradient Boosting',
        type: 'tree',
        accuracy: 0.85,
        precision: 0.83,
        recall: 0.85,
        f1: 0.84,
        auc: 0.88,
        trainingTime: 2.0,
        inferenceTime: 0.02,
        interpretability: 0.60,
        memoryUsage: 0.8
      },
      {
        name: 'Neural Network',
        type: 'neural',
        accuracy: 0.87,
        precision: 0.85,
        recall: 0.87,
        f1: 0.86,
        auc: 0.90,
        trainingTime: 5.0,
        inferenceTime: 0.005,
        interpretability: 0.20,
        memoryUsage: 0.5
      }
    ];

    // Simulate training time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResults(modelResults);
    setIsRunning(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'linear': return <TrendingUp className="h-5 w-5" />;
      case 'tree': return <BarChart3 className="h-5 w-5" />;
      case 'neural': return <Brain className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getModelColor = (type: string) => {
    switch (type) {
      case 'linear': return 'bg-blue-500';
      case 'tree': return 'bg-green-500';
      case 'neural': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aValue = a[sortBy as keyof ModelResult] as number;
    const bValue = b[sortBy as keyof ModelResult] as number;
    return bValue - aValue;
  });

  const getBestModel = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) => 
      current[selectedMetric as keyof ModelResult] > best[selectedMetric as keyof ModelResult] ? current : best
    );
  };

  const bestModel = getBestModel();

  // Get model details from config
  const getModelDetails = (modelName: string) => {
    return config?.models?.find(m => m.name === modelName);
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          {config?.title || 'Model Comparison Dashboard'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Compare different model architectures and their trade-offs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            onClick={simulateModelTraining}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Training Models...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Train & Compare Models
              </>
            )}
          </Button>

          {results.length > 0 && (
            <>
              <div className="flex items-center space-x-2">
                <label className={`text-sm font-medium ${themeClasses.text}`}>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-1 rounded border ${themeClasses.border} ${themeClasses.background}`}
                >
                  <option value="accuracy">Accuracy</option>
                  <option value="f1">F1 Score</option>
                  <option value="trainingTime">Training Time</option>
                  <option value="inferenceTime">Inference Time</option>
                  <option value="interpretability">Interpretability</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className={`text-sm font-medium ${themeClasses.text}`}>Metric:</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className={`px-3 py-1 rounded border ${themeClasses.border} ${themeClasses.background}`}
                >
                  <option value="accuracy">Accuracy</option>
                  <option value="precision">Precision</option>
                  <option value="recall">Recall</option>
                  <option value="f1">F1 Score</option>
                  <option value="auc">AUC</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Best Model Highlight */}
            {bestModel && (
              <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className={`font-semibold ${themeClasses.text}`}>
                    Best Model: {bestModel.name}
                  </span>
                  <Badge className="bg-green-500 text-white">
                    {bestModel[selectedMetric as keyof ModelResult]?.toFixed(3)}
                  </Badge>
                </div>
                <p className={`text-sm ${themeClasses.text}/80`}>
                  Best {selectedMetric} score: {(bestModel[selectedMetric as keyof ModelResult] as number)?.toFixed(3)}
                </p>
              </div>
            )}

            {/* Model Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`border-b ${themeClasses.border}`}>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Model</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Type</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Accuracy</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>F1 Score</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Training Time</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Inference Time</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Interpretability</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Memory</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((model, index) => (
                    <tr key={index} className={`border-b ${themeClasses.border}`}>
                      <td className={`p-2 font-medium ${themeClasses.text}`}>
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${getModelColor(model.type)} text-white`}>
                            {getModelIcon(model.type)}
                          </div>
                          {model.name}
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="capitalize">
                          {model.type}
                        </Badge>
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {model.accuracy.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {model.f1.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          {model.trainingTime.toFixed(1)}s
                        </div>
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          {model.inferenceTime.toFixed(3)}s
                        </div>
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          {(model.interpretability * 100).toFixed(0)}%
                        </div>
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {model.memoryUsage.toFixed(1)}MB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Model Characteristics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((model, index) => (
                <Card key={index} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-sm ${themeClasses.text} flex items-center`}>
                      <div className={`p-1 rounded ${getModelColor(model.type)} text-white mr-2`}>
                        {getModelIcon(model.type)}
                      </div>
                      {model.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className={`${themeClasses.text}/70`}>Accuracy:</span>
                        <span className={`${themeClasses.text}`}>{model.accuracy.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${themeClasses.text}/70`}>Speed:</span>
                        <span className={`${themeClasses.text}`}>{model.inferenceTime.toFixed(3)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${themeClasses.text}/70`}>Interpretable:</span>
                        <span className={`${themeClasses.text}`}>{(model.interpretability * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Model Scenarios */}
        {config?.scenarios && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>When to Use Each Model</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.scenarios.map((scenario, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>{scenario.name}</h5>
                  <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{scenario.reason}</p>
                  <div className="flex flex-wrap gap-1">
                    {scenario.recommended.map((model, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
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
                <strong>Linear models</strong> are fast and interpretable but limited to linear relationships.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Tree models</strong> handle non-linear relationships well and provide feature importance.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Neural networks</strong> are most flexible but require more data and are less interpretable.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Choose based on your constraints:</strong> data size, interpretability needs, and performance requirements.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Model Comparison Complete!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully compared different model architectures and learned their trade-offs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
