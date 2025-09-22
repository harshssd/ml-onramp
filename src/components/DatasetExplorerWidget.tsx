'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Database, AlertTriangle, CheckCircle, BarChart3, Users, TrendingUp } from 'lucide-react';

interface DatasetExplorerWidgetProps {
  onComplete?: () => void;
}

interface DataPoint {
  id: number;
  age: number;
  income: number;
  education: string;
  prediction: number;
}

export default function DatasetExplorerWidget({ onComplete }: DatasetExplorerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [dataset, setDataset] = useState<DataPoint[]>([]);
  const [biasLevel, setBiasLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [noiseLevel, setNoiseLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [showBias, setShowBias] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Generate sample dataset based on bias and noise levels
  const generateDataset = () => {
    const baseData: DataPoint[] = [];
    const biasMultiplier = biasLevel === 'high' ? 0.7 : biasLevel === 'medium' ? 0.85 : 1.0;
    const noiseMultiplier = noiseLevel === 'high' ? 0.3 : noiseLevel === 'medium' ? 0.15 : 0.05;

    for (let i = 0; i < 20; i++) {
      const age = 20 + Math.random() * 40;
      const education = Math.random() > 0.5 ? 'college' : 'high_school';
      
      // Introduce bias based on education
      const biasFactor = education === 'college' ? biasMultiplier : 1.0;
      const noise = (Math.random() - 0.5) * noiseMultiplier * 20000;
      
      const income = (age * 1000 + (education === 'college' ? 20000 : 10000)) * biasFactor + noise;
      
      baseData.push({
        id: i + 1,
        age: Math.round(age),
        income: Math.round(income),
        education,
        prediction: Math.round(income * (1 + (Math.random() - 0.5) * 0.1))
      });
    }
    
    setDataset(baseData);
  };

  useEffect(() => {
    generateDataset();
  }, [biasLevel, noiseLevel]);

  const getBiasDescription = () => {
    switch (biasLevel) {
      case 'low':
        return 'Fair representation across all groups';
      case 'medium':
        return 'Some groups slightly underrepresented';
      case 'high':
        return 'Significant bias toward certain groups';
      default:
        return '';
    }
  };

  const getNoiseDescription = () => {
    switch (noiseLevel) {
      case 'low':
        return 'Clean, consistent data';
      case 'medium':
        return 'Some measurement errors and outliers';
      case 'high':
        return 'High variability and many outliers';
      default:
        return '';
    }
  };

  const calculateAccuracy = () => {
    if (dataset.length === 0) return 0;
    const errors = dataset.map(d => Math.abs(d.income - d.prediction) / d.income);
    const avgError = errors.reduce((sum, error) => sum + error, 0) / errors.length;
    return Math.round((1 - avgError) * 100);
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
          <Database className="h-5 w-5 mr-2 text-blue-500" />
          Dataset Explorer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Explore how data quality affects machine learning models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className={`${themeClasses.text} font-semibold`}>Bias Level</Label>
              <div className="flex space-x-2 mt-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={biasLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBiasLevel(level)}
                    className={biasLevel === level ? 'bg-blue-500' : ''}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
              <p className={`text-sm ${themeClasses.text}/70 mt-1`}>
                {getBiasDescription()}
              </p>
            </div>

            <div>
              <Label className={`${themeClasses.text} font-semibold`}>Noise Level</Label>
              <div className="flex space-x-2 mt-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={noiseLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNoiseLevel(level)}
                    className={noiseLevel === level ? 'bg-purple-500' : ''}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
              <p className={`text-sm ${themeClasses.text}/70 mt-1`}>
                {getNoiseDescription()}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Dataset Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Samples:</span>
                <span className={`${themeClasses.text}`}>{dataset.length}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Accuracy:</span>
                <span className={`${themeClasses.text}`}>{calculateAccuracy()}%</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Bias:</span>
                <span className={`${themeClasses.text} ${
                  biasLevel === 'high' ? 'text-red-400' : 
                  biasLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {biasLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Noise:</span>
                <span className={`${themeClasses.text} ${
                  noiseLevel === 'high' ? 'text-red-400' : 
                  noiseLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {noiseLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold ${themeClasses.text}`}>Sample Data</h4>
            <Button
              onClick={() => setShowBias(!showBias)}
              variant="outline"
              size="sm"
              className={`${themeClasses.border}`}
            >
              {showBias ? 'Hide' : 'Show'} Bias Analysis
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${themeClasses.border}`}>
                  <th className={`text-left py-2 ${themeClasses.text}/70`}>ID</th>
                  <th className={`text-left py-2 ${themeClasses.text}/70`}>Age</th>
                  <th className={`text-left py-2 ${themeClasses.text}/70`}>Education</th>
                  <th className={`text-left py-2 ${themeClasses.text}/70`}>Income</th>
                  <th className={`text-left py-2 ${themeClasses.text}/70`}>Prediction</th>
                  {showBias && (
                    <th className={`text-left py-2 ${themeClasses.text}/70`}>Bias</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataset.slice(0, 10).map((point) => (
                  <tr key={point.id} className={`border-b ${themeClasses.border}`}>
                    <td className={`py-2 ${themeClasses.text}`}>{point.id}</td>
                    <td className={`py-2 ${themeClasses.text}`}>{point.age}</td>
                    <td className={`py-2 ${themeClasses.text}`}>
                      {point.education === 'college' ? '🎓 College' : '📚 High School'}
                    </td>
                    <td className={`py-2 ${themeClasses.text}`}>${point.income.toLocaleString()}</td>
                    <td className={`py-2 ${themeClasses.text}`}>${point.prediction.toLocaleString()}</td>
                    {showBias && (
                      <td className={`py-2 ${themeClasses.text}`}>
                        {point.education === 'college' && biasLevel !== 'low' ? (
                          <span className="text-red-400">⚠️</span>
                        ) : (
                          <span className="text-green-400">✅</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bias Analysis */}
        {showBias && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3 flex items-center`}>
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Bias Analysis
            </h4>
            <div className="space-y-2 text-sm">
              <p className={`${themeClasses.text}/80`}>
                <strong>Education Bias:</strong> {biasLevel === 'high' ? 'High' : biasLevel === 'medium' ? 'Medium' : 'Low'} 
                representation difference between college and high school graduates.
              </p>
              <p className={`${themeClasses.text}/80`}>
                <strong>Impact:</strong> {biasLevel === 'high' ? 'Model will be unfair to underrepresented groups' : 
                biasLevel === 'medium' ? 'Model may have slight bias' : 'Model should be relatively fair'}.
              </p>
              <p className={`${themeClasses.text}/80`}>
                <strong>Solution:</strong> Collect more diverse data, use bias detection tools, 
                and apply fairness constraints during training.
              </p>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Key Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <Database className="h-4 w-4 text-blue-400 mt-0.5" />
              <p className={`${themeClasses.text}/80`}>
                <strong>Data Quality Matters:</strong> Clean, unbiased data leads to better models.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
              <p className={`${themeClasses.text}/80`}>
                <strong>Bias is Dangerous:</strong> Biased data creates unfair models that perpetuate inequality.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <BarChart3 className="h-4 w-4 text-green-400 mt-0.5" />
              <p className={`${themeClasses.text}/80`}>
                <strong>More Data ≠ Better:</strong> Quality and diversity matter more than quantity.
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
              I Understand Data Quality
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
              You've learned how data quality affects machine learning models. 
              Remember: garbage in, garbage out!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
