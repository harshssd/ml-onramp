'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { TransformPreviewConfig } from '@/types/widget-configs';
import { 
  Database, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface TransformPreviewWidgetProps {
  onComplete?: () => void;
  config?: TransformPreviewConfig;
}

interface ColumnInfo {
  name: string;
  type: 'numeric' | 'categorical' | 'text' | 'date' | 'binary';
  missing: number;
  unique: number;
  sample: string;
  applied: string[];
}

export default function TransformPreviewWidget({ 
  onComplete, 
  config
}: TransformPreviewWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [appliedTransforms, setAppliedTransforms] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load CSV data
  useEffect(() => {
    if (config?.data_url) {
      setLoading(true);
      fetch(config.data_url)
        .then(response => response.text())
        .then(csvText => {
          const lines = csvText.trim().split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });
          setCsvData(data);
        })
        .catch(error => {
          console.error('Error loading CSV:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [config?.data_url]);

  // Generate column info from CSV data
  const generateColumnInfo = (): ColumnInfo[] => {
    if (csvData.length === 0) return [];
    
    const headers = Object.keys(csvData[0]);
    return headers.map(header => {
      const values = csvData.map(row => row[header]).filter(val => val !== '');
      const uniqueValues = [...new Set(values)];
      const missingCount = csvData.length - values.length;
      const sampleValue = values[0] || '';
      
      // Determine type based on column name and values
      let type: 'numeric' | 'categorical' | 'text' | 'date' | 'binary' = 'text';
      if (header === 'PassengerId') type = 'text';
      else if (header === 'Survived') type = 'binary';
      else if (['Age', 'SibSp', 'Parch', 'Fare'].includes(header)) type = 'numeric';
      else if (['Sex', 'Embarked', 'Pclass'].includes(header)) type = 'categorical';
      else if (['Ticket', 'Cabin'].includes(header)) type = 'text';
      
      return {
        name: header,
        type,
        missing: missingCount,
        unique: uniqueValues.length,
        sample: sampleValue,
        applied: []
      };
    });
  };

  const originalColumns = generateColumnInfo();
  const transformSteps = config?.steps || [];
  const totalSteps = transformSteps.length;

  const getTransformedColumns = (step: number): ColumnInfo[] => {
    if (step === 0) return originalColumns;
    
    const result = [...originalColumns];
    const appliedSteps = transformSteps.slice(0, step);
    
    appliedSteps.forEach(step => {
      if (step.name === 'impute_numeric') {
        step.columns.forEach(colName => {
          const col = result.find(c => c.name === colName);
          if (col) {
            col.missing = 0;
            col.applied.push('imputed');
          }
        });
      } else if (step.name === 'impute_categorical') {
        step.columns.forEach(colName => {
          const col = result.find(c => c.name === colName);
          if (col) {
            col.missing = 0;
            col.applied.push('imputed');
          }
        });
      } else if (step.name === 'add_missing_indicators') {
        step.columns.forEach(colName => {
          const indicatorCol: ColumnInfo = {
            name: `${colName}_missing`,
            type: 'binary',
            missing: 0,
            unique: 2,
            sample: '0',
            applied: ['missing_indicator']
          };
          result.push(indicatorCol);
        });
      } else if (step.name === 'one_hot_encode') {
        step.columns.forEach(colName => {
          const col = result.find(c => c.name === colName);
          if (col) {
            // Remove original column
            const index = result.findIndex(c => c.name === colName);
            result.splice(index, 1);
            
            // Add one-hot encoded columns
            const uniqueValues = col.unique;
            for (let i = 0; i < uniqueValues; i++) {
              const encodedCol: ColumnInfo = {
                name: `${colName}_${i}`,
                type: 'binary',
                missing: 0,
                unique: 2,
                sample: '0',
                applied: ['onehot']
              };
              result.push(encodedCol);
            }
          }
        });
      } else if (step.name === 'scale_numeric') {
        step.columns.forEach(colName => {
          const col = result.find(c => c.name === colName);
          if (col) {
            col.applied.push('scaled');
            col.sample = col.sample ? '0.12' : col.sample; // Example scaled value
          }
        });
      } else if (step.name === 'drop_columns') {
        step.columns.forEach(colName => {
          const index = result.findIndex(c => c.name === colName);
          if (index !== -1) {
            result.splice(index, 1);
          }
        });
      }
    });
    
    return result;
  };

  const handleApplyTransform = () => {
    if (currentStep < totalSteps) {
      const currentTransform = transformSteps[currentStep];
      setAppliedTransforms(prev => [...prev, currentTransform.name]);
      setCurrentStep(prev => prev + 1);
      
      if (currentStep + 1 >= totalSteps) {
        setCompleted(true);
        if (onComplete) {
          onComplete();
        }
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAppliedTransforms([]);
    setCompleted(false);
  };

  const currentColumns = getTransformedColumns(currentStep);

  if (loading) {
    return (
      <Card className={`${themeClasses.card} backdrop-blur-sm`}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${themeClasses.text}`}>Loading dataset...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Settings className="h-5 w-5 mr-2 text-blue-500" />
          {config?.title || 'Transform Preview'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          {config?.leakage_guard ? 'Safe pipeline with leakage prevention' : 'See how data transforms affect your dataset schema in real-time'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${themeClasses.text}`}>
              Transform Progress
            </span>
            <span className={`text-sm ${themeClasses.text}/70`}>
              {currentStep} of {totalSteps} steps
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Transform Steps */}
        <div className="space-y-3">
          {transformSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  isCompleted 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-400'
                  } text-white`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${themeClasses.text}`}>
                      {step.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <p className={`text-sm ${themeClasses.text}/70`}>
                      {step.strategy && `Strategy: ${step.strategy}`}
                      {step.method && `Method: ${step.method}`}
                      {step.columns && `Columns: ${step.columns.join(', ')}`}
                    </p>
                  </div>
                  {isCompleted && (
                    <Badge className="bg-green-500 text-white">
                      Applied
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge className="bg-blue-500 text-white">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Dataset Schema */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold ${themeClasses.text}`}>
              Dataset Schema {currentStep > 0 && `(After ${transformSteps[currentStep - 1]?.name.replace(/_/g, ' ')})`}
            </h4>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
              className={themeClasses.border}
            >
              {showDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`border-b ${themeClasses.border}`}>
                  <th className={`text-left p-2 ${themeClasses.text}`}>Column</th>
                  <th className={`text-left p-2 ${themeClasses.text}`}>Type</th>
                  <th className={`text-left p-2 ${themeClasses.text}`}>Missing</th>
                  <th className={`text-left p-2 ${themeClasses.text}`}>Unique</th>
                  <th className={`text-left p-2 ${themeClasses.text}`}>Sample</th>
                  {showDetails && (
                    <th className={`text-left p-2 ${themeClasses.text}`}>Applied</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentColumns.map((col, index) => (
                  <tr key={index} className={`border-b ${themeClasses.border}`}>
                    <td className={`p-2 font-mono text-sm ${themeClasses.text}`}>
                      {col.name}
                    </td>
                    <td className="p-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          col.type === 'numeric' ? 'border-blue-500 text-blue-500' :
                          col.type === 'categorical' ? 'border-green-500 text-green-500' :
                          col.type === 'binary' ? 'border-purple-500 text-purple-500' :
                          'border-gray-500 text-gray-500'
                        }`}
                      >
                        {col.type}
                      </Badge>
                    </td>
                    <td className={`p-2 text-sm ${themeClasses.text}`}>
                      {col.missing}
                    </td>
                    <td className={`p-2 text-sm ${themeClasses.text}`}>
                      {col.unique}
                    </td>
                    <td className={`p-2 text-sm font-mono ${themeClasses.text}`}>
                      {col.sample}
                    </td>
                    {showDetails && (
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {col.applied.map((transform, idx) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                              {transform}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className={`font-medium ${themeClasses.text}`}>Key Insights:</span>
            </div>
            <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
              <li>• <strong>Imputation</strong> fills missing values with appropriate strategies</li>
              <li>• <strong>One-Hot Encoding</strong> creates binary columns for categories</li>
              <li>• <strong>Missing Indicators</strong> preserve the signal that a value was missing</li>
              <li>• <strong>Scaling</strong> normalizes numeric features to similar ranges</li>
              <li>• Always fit transforms on training data only to avoid leakage</li>
            </ul>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleReset}
            variant="outline"
            className={themeClasses.border}
            disabled={currentStep === 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          {!completed ? (
            <Button
              onClick={handleApplyTransform}
              disabled={currentStep >= totalSteps}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {currentStep >= totalSteps ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  All Transforms Applied
                </>
              ) : (
                <>
                  Apply {transformSteps[currentStep]?.name.replace(/_/g, ' ')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className={`font-medium ${themeClasses.text}`}>
                All transforms completed!
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}