'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { Brain, Target, CheckCircle, RotateCcw, Zap, Layers, Settings, Play } from 'lucide-react';

interface NeuralNetworkVisualizerWidgetProps {
  onComplete?: () => void;
  data?: string[];
}

interface Neuron {
  id: string;
  layer: number;
  x: number;
  y: number;
  value: number;
  activation: number;
}

interface Connection {
  from: string;
  to: string;
  weight: number;
}

type ActivationFunction = 'sigmoid' | 'relu' | 'tanh' | 'linear';

export default function NeuralNetworkVisualizerWidget({ onComplete, data = ["input-layer","hidden-layer","output-layer","weights","activation"] }: NeuralNetworkVisualizerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activationFunction, setActivationFunction] = useState<ActivationFunction>('sigmoid');
  const [numHiddenLayers, setNumHiddenLayers] = useState([1]);
  const [numHiddenNeurons, setNumHiddenNeurons] = useState([3]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize network structure
  const initializeNetwork = () => {
    const newNeurons: Neuron[] = [];
    const newConnections: Connection[] = [];
    
    // Input layer (2 neurons)
    for (let i = 0; i < 2; i++) {
      newNeurons.push({
        id: `input-${i}`,
        layer: 0,
        x: 50,
        y: 100 + i * 80,
        value: Math.random() * 2 - 1, // Random input between -1 and 1
        activation: 0
      });
    }
    
    // Hidden layers
    for (let layer = 1; layer <= numHiddenLayers[0]; layer++) {
      for (let i = 0; i < numHiddenNeurons[0]; i++) {
        const x = 200 + (layer - 1) * 150;
        const y = 100 + i * (160 / (numHiddenNeurons[0] - 1));
        
        newNeurons.push({
          id: `hidden-${layer}-${i}`,
          layer,
          x,
          y,
          value: 0,
          activation: 0
        });
      }
    }
    
    // Output layer (1 neuron)
    newNeurons.push({
      id: 'output-0',
      layer: numHiddenLayers[0] + 1,
      x: 200 + numHiddenLayers[0] * 150,
      y: 140,
      value: 0,
      activation: 0
    });
    
    // Create connections
    for (let i = 0; i < newNeurons.length; i++) {
      const fromNeuron = newNeurons[i];
      
      for (let j = 0; j < newNeurons.length; j++) {
        const toNeuron = newNeurons[j];
        
        // Connect to next layer only
        if (toNeuron.layer === fromNeuron.layer + 1) {
          newConnections.push({
            from: fromNeuron.id,
            to: toNeuron.id,
            weight: Math.random() * 2 - 1 // Random weight between -1 and 1
          });
        }
      }
    }
    
    setNeurons(newNeurons);
    setConnections(newConnections);
  };

  useEffect(() => {
    initializeNetwork();
  }, [numHiddenLayers, numHiddenNeurons]);

  // Apply activation function
  const applyActivation = (value: number): number => {
    switch (activationFunction) {
      case 'sigmoid':
        return 1 / (1 + Math.exp(-value));
      case 'relu':
        return Math.max(0, value);
      case 'tanh':
        return Math.tanh(value);
      case 'linear':
        return value;
      default:
        return value;
    }
  };

  // Forward propagation
  const forwardPropagation = () => {
    setIsAnimating(true);
    
    // Reset all neuron values except inputs
    const updatedNeurons = neurons.map(neuron => {
      if (neuron.layer === 0) {
        return { ...neuron, activation: neuron.value };
      }
      return { ...neuron, value: 0, activation: 0 };
    });
    
    // Process each layer
    for (let layer = 1; layer <= numHiddenLayers[0] + 1; layer++) {
      const layerNeurons = updatedNeurons.filter(n => n.layer === layer);
      
      layerNeurons.forEach(neuron => {
        let sum = 0;
        
        // Sum weighted inputs from previous layer
        connections
          .filter(conn => conn.to === neuron.id)
          .forEach(conn => {
            const fromNeuron = updatedNeurons.find(n => n.id === conn.from);
            if (fromNeuron) {
              sum += fromNeuron.activation * conn.weight;
            }
          });
        
        // Apply activation function
        const activation = applyActivation(sum);
        
        // Update neuron
        const neuronIndex = updatedNeurons.findIndex(n => n.id === neuron.id);
        if (neuronIndex !== -1) {
          updatedNeurons[neuronIndex] = {
            ...updatedNeurons[neuronIndex],
            value: sum,
            activation
          };
        }
      });
    }
    
    setNeurons(updatedNeurons);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  // Draw the network
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
    
    // Draw connections
    connections.forEach(conn => {
      const fromNeuron = neurons.find(n => n.id === conn.from);
      const toNeuron = neurons.find(n => n.id === conn.to);
      
      if (fromNeuron && toNeuron) {
        ctx.strokeStyle = conn.weight > 0 ? '#10b981' : '#ef4444';
        ctx.lineWidth = Math.abs(conn.weight) * 3;
        ctx.globalAlpha = 0.7;
        
        ctx.beginPath();
        ctx.moveTo(fromNeuron.x, fromNeuron.y);
        ctx.lineTo(toNeuron.x, toNeuron.y);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
      }
    });
    
    // Draw neurons
    neurons.forEach(neuron => {
      const radius = 20;
      const intensity = Math.abs(neuron.activation);
      const color = neuron.activation > 0 ? '#3b82f6' : '#ef4444';
      
      // Neuron circle
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3 + intensity * 0.7;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Neuron border
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      ctx.stroke();
      
      // Neuron value
      ctx.fillStyle = themeClasses.text;
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        neuron.activation.toFixed(2),
        neuron.x,
        neuron.y + 4
      );
      
      // Layer labels
      if (neuron.layer === 0) {
        ctx.fillStyle = themeClasses.text;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Input', neuron.x, neuron.y - 30);
      } else if (neuron.layer === numHiddenLayers[0] + 1) {
        ctx.fillStyle = themeClasses.text;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Output', neuron.x, neuron.y - 30);
      }
    });
    
  }, [neurons, connections, activationFunction, themeClasses.background, themeClasses.text]);

  const getActivationDescription = (func: ActivationFunction) => {
    switch (func) {
      case 'sigmoid':
        return 'Squashes values to 0-1 range, good for probabilities';
      case 'relu':
        return 'Returns input if positive, 0 otherwise. Fast and avoids vanishing gradients';
      case 'tanh':
        return 'Squashes values to -1 to 1 range, centered around 0';
      case 'linear':
        return 'No transformation, just passes the value through';
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
          Neural Network Visualizer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Build and visualize neural networks to understand how they work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Structure Controls */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Network Structure</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Hidden Layers: {numHiddenLayers[0]}
              </label>
              <Slider
                value={numHiddenLayers}
                onValueChange={setNumHiddenLayers}
                max={3}
                min={1}
                step={1}
                className="w-full"
                disabled={isAnimating}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Neurons per Layer: {numHiddenNeurons[0]}
              </label>
              <Slider
                value={numHiddenNeurons}
                onValueChange={setNumHiddenNeurons}
                max={5}
                min={2}
                step={1}
                className="w-full"
                disabled={isAnimating}
              />
            </div>
          </div>
        </div>

        {/* Activation Function Selection */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Activation Function</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['sigmoid', 'relu', 'tanh', 'linear'] as ActivationFunction[]).map(func => (
              <Button
                key={func}
                variant={activationFunction === func ? "default" : "outline"}
                onClick={() => setActivationFunction(func)}
                className={`text-sm ${
                  activationFunction === func 
                    ? 'bg-blue-500 text-white' 
                    : themeClasses.border
                }`}
                disabled={isAnimating}
              >
                {func.charAt(0).toUpperCase() + func.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <p className={`text-sm ${themeClasses.text}/80`}>
              <strong>{activationFunction.charAt(0).toUpperCase() + activationFunction.slice(1)}:</strong> {getActivationDescription(activationFunction)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          <Button
            onClick={forwardPropagation}
            disabled={isAnimating}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isAnimating ? (
              <>
                <Play className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Forward Pass
              </>
            )}
          </Button>
          <Button
            onClick={initializeNetwork}
            variant="outline"
            className={`${themeClasses.border}`}
            disabled={isAnimating}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Network
          </Button>
        </div>

        {/* Network Visualization */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Neural Network Visualization</h4>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="border rounded-lg bg-white dark:bg-gray-900"
            />
            <div className="absolute top-2 right-2 text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={themeClasses.text}>Positive Weight</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={themeClasses.text}>Negative Weight</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Information */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Network Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className={`font-medium ${themeClasses.text}`}>Structure:</div>
              <div className={`${themeClasses.text}/70`}>
                2 inputs → {numHiddenLayers[0]} hidden layer{numHiddenLayers[0] > 1 ? 's' : ''} ({numHiddenNeurons[0]} neurons each) → 1 output
              </div>
            </div>
            <div>
              <div className={`font-medium ${themeClasses.text}`}>Total Neurons:</div>
              <div className={`${themeClasses.text}/70`}>
                {2 + (numHiddenLayers[0] * numHiddenNeurons[0]) + 1}
              </div>
            </div>
            <div>
              <div className={`font-medium ${themeClasses.text}`}>Total Weights:</div>
              <div className={`${themeClasses.text}/70`}>
                {connections.length}
              </div>
            </div>
          </div>
        </div>

        {/* Key Concepts */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Key Concepts</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Forward Propagation:</strong> Data flows from input → hidden layers → output, with each neuron applying weights and activation.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Weights:</strong> Control how much each input influences each neuron. Green = positive, red = negative.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Activation Functions:</strong> Introduce non-linearity so networks can learn complex patterns.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Neuron Values:</strong> Show the final output after applying weights and activation function.
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
              I Understand Neural Networks
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
              You now understand the fundamentals of neural networks! This knowledge 
              is the foundation for all modern deep learning and AI systems.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
