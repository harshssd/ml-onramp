'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { HyperparamTuningConfig } from '@/types/widget-configs';
import { 
  Settings, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

interface HyperparamTuningWidgetProps {
  onComplete?: () => void;
  config?: HyperparamTuningConfig;
}

interface TuningResult {
  method: string;
  bestScore: number;
  bestParams: Record<string, any>;
  iterations: number;
  timeElapsed: number;
  convergence: number[];
}

export default function HyperparamTuningWidget({ 
  onComplete, 
  config
}: HyperparamTuningWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TuningResult[]>([]);
  const [completed, setCompleted] = useState(false);

  const models = config?.models || [];
  const methods = config?.tuning_methods || [];

  const simulateTuning = async (modelName: string, methodName: string) => {
    setIsRunning(true);
    
    // Simulate different performance based on method
    const baseScore = 0.75 + Math.random() * 0.15;
    const methodMultiplier = {
      'Grid Search': 1.0,
      'Random Search': 0.98,
      'Bayesian Optimization': 1.02
    };
    
    const bestScore = baseScore * (methodMultiplier[methodName as keyof typeof methodMultiplier] || 1.0);
    const iterations = methodName === 'Grid Search' ? 20 : methodName === 'Random Search' ? 30 : 25;
    const timeElapsed = methodName === 'Grid Search' ? 5.0 : methodName === 'Random Search' ? 3.0 : 2.5;
    
    // Simulate convergence curve
    const convergence = Array.from({ length: iterations }, (_, i) => {
      const progress = i / iterations;
      const noise = (Math.random() - 0.5) * 0.02;
      return bestScore * (0.7 + 0.3 * progress) + noise;
    });

    // Simulate training time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result: TuningResult = {
      method: methodName,
      bestScore,
      bestParams: generateBestParams(modelName),
      iterations,
      timeElapsed,
      convergence
    };
    
    setResults(prev => [...prev, result]);
    setIsRunning(false);
  };

  const generateBestParams = (modelName: string) => {
    const model = models.find(m => m.name === modelName);
    if (!model) return {};
    
    const params: Record<string, any> = {};
    Object.entries(model.params).forEach(([key, param]) => {
      if (param.type === 'int') {
        params[key] = Math.floor(Math.random() * (param.range[1] - param.range[0]) + param.range[0]);
      } else if (param.type === 'float') {
        params[key] = Math.random() * (param.range[1] - param.range[0]) + param.range[0];
      } else if (param.type === 'categorical') {
        params[key] = param.options[Math.floor(Math.random() * param.options.length)];
      }
    });
    
    return params;
  };

  const handleStartTuning = () => {
    if (selectedModel && selectedMethod) {
      simulateTuning(selectedModel, selectedMethod);
    }
  };

  const handleCompareAll = async () => {
    if (!selectedModel) return;
    
    setIsRunning(true);
    
    // Run all methods
    for (const method of methods) {
      await simulateTuning(selectedModel, method.name);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between methods
    }
    
    setIsRunning(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const getBestResult = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) => 
      current.bestScore > best.bestScore ? current : best
    );
  };

  const bestResult = getBestResult();

  // Get model details from config
  const getModelDetails = (modelName: string) => {
    return config?.models?.find(m => m.name === modelName);
  };

  // Get search method details from config
  const getSearchMethodDetails = (methodName: string) => {
    return config?.search_methods?.find(m => m.name === methodName);
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Settings className="h-5 w-5 mr-2 text-blue-500" />
          {config?.title || 'Hyperparameter Tuning Playground'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Experiment with different hyperparameter tuning methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model and Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${themeClasses.text}`}>Select Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${themeClasses.border} ${themeClasses.background}`}
            >
              <option value="">Choose a model...</option>
              {models.map((model, index) => (
                <option key={index} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${themeClasses.text}`}>Select Method:</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${themeClasses.border} ${themeClasses.background}`}
            >
              <option value="">Choose a method...</option>
              {methods.map((method, index) => (
                <option key={index} value={method.name}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Method Descriptions */}
        {selectedMethod && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
              {methods.find(m => m.name === selectedMethod)?.name}
            </h4>
            <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
              {methods.find(m => m.name === selectedMethod)?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Pros:</h5>
                <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                  {methods.find(m => m.name === selectedMethod)?.pros.map((pro, index) => (
                    <li key={index}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Cons:</h5>
                <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                  {methods.find(m => m.name === selectedMethod)?.cons.map((con, index) => (
                    <li key={index}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-3">
          <Button
            onClick={handleStartTuning}
            disabled={!selectedModel || !selectedMethod || isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Tuning...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Tuning
              </>
            )}
          </Button>
          
          <Button
            onClick={handleCompareAll}
            disabled={!selectedModel || isRunning}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare All Methods
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Best Result Highlight */}
            {bestResult && (
              <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className={`font-semibold ${themeClasses.text}`}>
                    Best Result: {bestResult.method}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`${themeClasses.text}/70`}>Best Score:</span>
                    <div className={`font-semibold ${themeClasses.text}`}>
                      {bestResult.bestScore.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <span className={`${themeClasses.text}/70`}>Iterations:</span>
                    <div className={`font-semibold ${themeClasses.text}`}>
                      {bestResult.iterations}
                    </div>
                  </div>
                  <div>
                    <span className={`${themeClasses.text}/70`}>Time:</span>
                    <div className={`font-semibold ${themeClasses.text}`}>
                      {bestResult.timeElapsed.toFixed(1)}s
                    </div>
                  </div>
                  <div>
                    <span className={`${themeClasses.text}/70`}>Best Params:</span>
                    <div className={`font-semibold ${themeClasses.text}`}>
                      {Object.keys(bestResult.bestParams).length} tuned
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`border-b ${themeClasses.border}`}>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Method</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Best Score</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Iterations</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Time (s)</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Best Params</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .sort((a, b) => b.bestScore - a.bestScore)
                    .map((result, index) => (
                    <tr key={index} className={`border-b ${themeClasses.border}`}>
                      <td className={`p-2 font-medium ${themeClasses.text}`}>
                        {result.method}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.bestScore.toFixed(4)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.iterations}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.timeElapsed.toFixed(1)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        <div className="text-xs">
                          {Object.entries(result.bestParams).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-mono">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Convergence Visualization */}
            <div className="space-y-4">
              <h4 className={`font-semibold ${themeClasses.text}`}>Convergence Curves</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, index) => (
                  <Card key={index} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm ${themeClasses.text}`}>
                        {result.method}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded flex items-end space-x-1 p-2">
                        {result.convergence.map((value, i) => (
                          <div
                            key={i}
                            className="bg-blue-500 rounded-sm flex-1"
                            style={{ height: `${(value / Math.max(...result.convergence)) * 100}%` }}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-center mt-2">
                        Final: {result.bestScore.toFixed(4)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tuning Scenarios */}
        {config?.scenarios && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Tuning Scenarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {config.scenarios.map((scenario, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>{scenario.name}</h5>
                  <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{scenario.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Method:</span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.method}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Trials:</span>
                      <span className={`${themeClasses.text}/80`}>{scenario.max_trials}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Focus:</span>
                      <span className={`${themeClasses.text}/80`}>{scenario.focus.join(', ')}</span>
                    </div>
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
                <strong>Grid Search</strong> is thorough but expensive for high-dimensional spaces.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Random Search</strong> is more efficient and often finds good solutions faster.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Bayesian Optimization</strong> learns from previous evaluations to guide the search.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Always use cross-validation</strong> to avoid overfitting to the validation set.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Hyperparameter Tuning Complete!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully compared different tuning methods and found optimal hyperparameters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
