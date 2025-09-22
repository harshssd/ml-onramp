'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { OptimizationLabConfig } from '@/types/widget-configs';
import { 
  Settings, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Target,
  Zap,
  Brain,
  Activity
} from 'lucide-react';

interface OptimizationLabWidgetProps {
  onComplete?: () => void;
  config?: OptimizationLabConfig;
}

interface OptimizationResult {
  model: string;
  technique: string;
  parameters: Record<string, any>;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    training_time: number;
    model_size: number;
    inference_time: number;
  };
  improvement: {
    accuracy_change: number;
    time_change: number;
    size_change: number;
  };
}

export default function OptimizationLabWidget({ 
  onComplete, 
  config
}: OptimizationLabWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');
  const [techniqueParameters, setTechniqueParameters] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [completed, setCompleted] = useState(false);

  const models = config?.models || [];
  const techniques = config?.techniques || [];

  const simulateOptimization = async (modelName: string, techniqueName: string, parameters: Record<string, any>) => {
    setIsRunning(true);
    
    // Simulate optimization computation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic optimization results
    const baseAccuracy = 0.75 + Math.random() * 0.2; // 75-95% base accuracy
    const accuracyChange = (Math.random() - 0.5) * 0.1; // ±5% change
    const timeChange = (Math.random() - 0.5) * 0.3; // ±30% change
    const sizeChange = (Math.random() - 0.5) * 0.4; // ±40% change
    
    const newResult: OptimizationResult = {
      model: modelName,
      technique: techniqueName,
      parameters,
      metrics: {
        accuracy: baseAccuracy + accuracyChange,
        precision: baseAccuracy + accuracyChange + (Math.random() - 0.5) * 0.05,
        recall: baseAccuracy + accuracyChange + (Math.random() - 0.5) * 0.05,
        f1: baseAccuracy + accuracyChange + (Math.random() - 0.5) * 0.03,
        training_time: Math.random() * 10 + 1, // 1-11 seconds
        model_size: Math.random() * 1000 + 100, // 100-1100 KB
        inference_time: Math.random() * 100 + 10 // 10-110 ms
      },
      improvement: {
        accuracy_change: accuracyChange,
        time_change: timeChange,
        size_change: sizeChange
      }
    };
    
    setResults(prev => [...prev, newResult]);
    setIsRunning(false);
  };

  const handleStartOptimization = () => {
    if (selectedModel && selectedTechnique) {
      simulateOptimization(selectedModel, selectedTechnique, techniqueParameters);
    }
  };

  const handleCompareAll = async () => {
    if (!selectedModel) return;
    
    setIsRunning(true);
    
    // Run all applicable techniques for the selected model
    const applicableTechniques = techniques.filter(t => 
      t.applicable_models?.includes(selectedModel)
    );
    
    for (const technique of applicableTechniques) {
      await simulateOptimization(selectedModel, technique.name, {});
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between techniques
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
      current.metrics.accuracy > best.metrics.accuracy ? current : best
    );
  };

  const bestResult = getBestResult();

  // Get model details from config
  const getModelDetails = (modelName: string) => {
    return config?.models?.find(m => m.name === modelName);
  };

  // Get technique details from config
  const getTechniqueDetails = (techniqueName: string) => {
    return config?.techniques?.find(t => t.name === techniqueName);
  };

  // Get applicable techniques for selected model
  const getApplicableTechniques = () => {
    if (!selectedModel) return [];
    return techniques.filter(t => 
      t.applicable_models?.includes(selectedModel)
    );
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Settings className="h-5 w-5 mr-2 text-purple-500" />
          {config?.title || 'Optimization Lab'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Experiment with different optimization techniques and their effects on model performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Select Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedTechnique(''); // Reset technique when model changes
              }}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value="">Choose a model...</option>
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Optimization Technique
            </label>
            <select
              value={selectedTechnique}
              onChange={(e) => setSelectedTechnique(e.target.value)}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
              disabled={!selectedModel}
            >
              <option value="">Choose technique...</option>
              {getApplicableTechniques().map((technique) => (
                <option key={technique.name} value={technique.name}>
                  {technique.display_name || technique.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technique Description */}
        {selectedTechnique && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
              {getTechniqueDetails(selectedTechnique)?.display_name}
            </h4>
            <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
              {getTechniqueDetails(selectedTechnique)?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Benefits:</h5>
                <ul className="space-y-1">
                  {getTechniqueDetails(selectedTechnique)?.pros?.map((pro, index) => (
                    <li key={index} className={`${themeClasses.text}/70`}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Considerations:</h5>
                <ul className="space-y-1">
                  {getTechniqueDetails(selectedTechnique)?.cons?.map((con, index) => (
                    <li key={index} className={`${themeClasses.text}/70`}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button 
            onClick={handleStartOptimization}
            disabled={!selectedModel || !selectedTechnique || isRunning}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Optimizing...' : 'Apply Optimization'}
          </Button>
          <Button 
            onClick={handleCompareAll}
            disabled={!selectedModel || isRunning}
            variant="outline"
            className="flex-1"
          >
            <Activity className="h-4 w-4 mr-2" />
            Compare All Techniques
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-green-500" />
              Optimization Results
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => {
                const techniqueDetails = getTechniqueDetails(result.technique);
                return (
                  <Card key={index} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-sm ${themeClasses.text}`}>
                          {result.model}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {result.technique}
                        </Badge>
                      </div>
                      <CardDescription className={`text-xs ${themeClasses.text}/70`}>
                        {techniqueDetails?.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Accuracy:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {(result.metrics.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Training Time:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {result.metrics.training_time.toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Model Size:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {result.metrics.model_size.toFixed(0)}KB
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Inference Time:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {result.metrics.inference_time.toFixed(0)}ms
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Best Result */}
            {bestResult && (
              <Card className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h5 className={`font-semibold ${themeClasses.text}`}>Best Optimization Result</h5>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${themeClasses.text}/60`}>Model:</span>
                      <div className={`font-medium ${themeClasses.text}`}>{bestResult.model}</div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Technique:</span>
                      <div className={`font-medium ${themeClasses.text}`}>{bestResult.technique}</div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Accuracy:</span>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {(bestResult.metrics.accuracy * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Improvement:</span>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {(bestResult.improvement.accuracy_change * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Optimization Scenarios */}
        {config?.scenarios && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>When to Use Each Technique</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.scenarios.map((scenario, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>{scenario.name}</h5>
                  <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{scenario.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Techniques:</span>
                      <div className="flex flex-wrap gap-1">
                        {scenario.recommended_techniques.map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className={`text-xs ${themeClasses.text}/70 mt-2`}>{scenario.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Pitfalls */}
        {config?.common_pitfalls && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Common Pitfalls to Avoid</h4>
            <div className="space-y-3">
              {config.common_pitfalls.map((pitfall, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <h5 className={`font-medium ${themeClasses.text} mb-1`}>{pitfall.pitfall}</h5>
                      <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{pitfall.description}</p>
                      <div className="text-xs">
                        <div className={`${themeClasses.text}/60 mb-1`}><strong>Solution:</strong> {pitfall.solution}</div>
                        <div className={`${themeClasses.text}/60`}><strong>Example:</strong> {pitfall.example}</div>
                      </div>
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
                <strong>Regularization</strong> prevents overfitting by constraining model complexity.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Early stopping</strong> saves computational resources and prevents overfitting.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Dropout</strong> improves generalization by preventing co-adaptation of neurons.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Consider production constraints</strong> when choosing optimization techniques.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Optimization Complete!</h5>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully experimented with different optimization techniques. Use these insights to build production-ready models.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
