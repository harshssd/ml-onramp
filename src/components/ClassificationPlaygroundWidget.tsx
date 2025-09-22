'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Target, CheckCircle, XCircle, RotateCcw, Brain, Zap } from 'lucide-react';

interface ClassificationPlaygroundWidgetProps {
  onComplete?: () => void;
}

interface DataPoint {
  id: number;
  features: number[];
  label: string;
  predictedLabel?: string;
  confidence?: number;
}

interface Category {
  name: string;
  color: string;
  description: string;
}

export default function ClassificationPlaygroundWidget({ onComplete }: ClassificationPlaygroundWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isTraining, setIsTraining] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Initialize sample data
  useEffect(() => {
    const sampleCategories: Category[] = [
      { name: 'Fruits', color: 'bg-red-500', description: 'Sweet, colorful, often round' },
      { name: 'Vegetables', color: 'bg-green-500', description: 'Savory, various shapes, often green' },
      { name: 'Grains', color: 'bg-yellow-500', description: 'Small, hard, often brown' }
    ];
    setCategories(sampleCategories);

    const sampleData: DataPoint[] = [
      { id: 1, features: [0.8, 0.9, 0.7], label: 'Fruits' }, // Apple
      { id: 2, features: [0.9, 0.8, 0.6], label: 'Fruits' }, // Orange
      { id: 3, features: [0.2, 0.8, 0.3], label: 'Vegetables' }, // Carrot
      { id: 4, features: [0.1, 0.9, 0.2], label: 'Vegetables' }, // Broccoli
      { id: 5, features: [0.3, 0.2, 0.9], label: 'Grains' }, // Rice
      { id: 6, features: [0.4, 0.1, 0.8], label: 'Grains' }, // Wheat
    ];
    setDataPoints(sampleData);
  }, []);

  const trainModel = async () => {
    setIsTraining(true);
    
    // Simulate training process
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update data points with predictions
      const updatedData = dataPoints.map(point => {
        // Simple classification based on feature values
        const [sweetness, colorfulness, hardness] = point.features;
        let predictedLabel = 'Grains';
        let confidence = 0.5;
        
        if (sweetness > 0.7 && colorfulness > 0.7) {
          predictedLabel = 'Fruits';
          confidence = 0.9;
        } else if (sweetness < 0.5 && colorfulness > 0.6) {
          predictedLabel = 'Vegetables';
          confidence = 0.8;
        } else if (hardness > 0.7) {
          predictedLabel = 'Grains';
          confidence = 0.7;
        }
        
        return {
          ...point,
          predictedLabel,
          confidence
        };
      });
      
      setDataPoints(updatedData);
    }
    
    // Calculate accuracy
    const correct = dataPoints.filter(point => point.label === point.predictedLabel).length;
    setAccuracy(Math.round((correct / dataPoints.length) * 100));
    setModelTrained(true);
    setIsTraining(false);
  };

  const addDataPoint = () => {
    if (!selectedCategory) return;
    
    const newPoint: DataPoint = {
      id: dataPoints.length + 1,
      features: [
        Math.random(),
        Math.random(),
        Math.random()
      ],
      label: selectedCategory
    };
    
    setDataPoints([...dataPoints, newPoint]);
  };

  const resetData = () => {
    const sampleData: DataPoint[] = [
      { id: 1, features: [0.8, 0.9, 0.7], label: 'Fruits' },
      { id: 2, features: [0.9, 0.8, 0.6], label: 'Fruits' },
      { id: 3, features: [0.2, 0.8, 0.3], label: 'Vegetables' },
      { id: 4, features: [0.1, 0.9, 0.2], label: 'Vegetables' },
      { id: 5, features: [0.3, 0.2, 0.9], label: 'Grains' },
      { id: 6, features: [0.4, 0.1, 0.8], label: 'Grains' },
    ];
    setDataPoints(sampleData);
    setModelTrained(false);
    setAccuracy(0);
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const getFeatureName = (index: number) => {
    const names = ['Sweetness', 'Colorfulness', 'Hardness'];
    return names[index] || `Feature ${index + 1}`;
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Classification Playground
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Learn how machines sort data into categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>How Classification Works:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• <strong>Features:</strong> Measurable properties (sweetness, color, hardness)</li>
            <li>• <strong>Labels:</strong> Categories we want to predict (fruits, vegetables, grains)</li>
            <li>• <strong>Training:</strong> Machine learns patterns from labeled examples</li>
            <li>• <strong>Prediction:</strong> Machine assigns new items to categories</li>
          </ul>
        </div>

        {/* Add Data Point */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Add Training Data</h4>
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 rounded border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value="">Select category...</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button
              onClick={addDataPoint}
              disabled={!selectedCategory}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Data Point
            </Button>
          </div>
        </div>

        {/* Data Points Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold ${themeClasses.text}`}>Training Data</h4>
            <div className="flex space-x-2">
              <Button
                onClick={trainModel}
                disabled={isTraining || dataPoints.length < 3}
                className="bg-green-500 hover:bg-green-600 text-white"
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
                onClick={resetData}
                variant="outline"
                className={`${themeClasses.border}`}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${themeClasses.border}`}>
                  <th className={`text-left py-2 ${themeClasses.text}/70`}>ID</th>
                  {[0, 1, 2].map(i => (
                    <th key={i} className={`text-left py-2 ${themeClasses.text}/70`}>
                      {getFeatureName(i)}
                    </th>
                  ))}
                  <th className={`text-left py-2 ${themeClasses.text}/70`}>True Label</th>
                  {modelTrained && (
                    <>
                      <th className={`text-left py-2 ${themeClasses.text}/70`}>Predicted</th>
                      <th className={`text-left py-2 ${themeClasses.text}/70`}>Confidence</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataPoints.map(point => (
                  <tr key={point.id} className={`border-b ${themeClasses.border}`}>
                    <td className={`py-2 ${themeClasses.text}`}>{point.id}</td>
                    {point.features.map((feature, index) => (
                      <td key={index} className={`py-2 ${themeClasses.text}`}>
                        {feature.toFixed(2)}
                      </td>
                    ))}
                    <td className="py-2">
                      <Badge className={`${categories.find(c => c.name === point.label)?.color} text-white`}>
                        {point.label}
                      </Badge>
                    </td>
                    {modelTrained && point.predictedLabel && (
                      <>
                        <td className="py-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={`${categories.find(c => c.name === point.predictedLabel)?.color} text-white`}>
                              {point.predictedLabel}
                            </Badge>
                            {point.label === point.predictedLabel ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className={`py-2 ${themeClasses.text}`}>
                          {Math.round((point.confidence || 0) * 100)}%
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Performance */}
        {modelTrained && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Model Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{accuracy}%</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{dataPoints.length}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Training Examples</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{categories.length}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Categories</div>
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
                <strong>More Data = Better Learning:</strong> The more examples you provide, the better the model learns.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Features Matter:</strong> The right features (sweetness, color, hardness) help the model make good decisions.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Confidence Scores:</strong> Models can tell you how sure they are about their predictions.
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
              I Understand Classification
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Great Job!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You now understand how classification works! This is the foundation of many AI applications 
              like spam detection, image recognition, and medical diagnosis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
