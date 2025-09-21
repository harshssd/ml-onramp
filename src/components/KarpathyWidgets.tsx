'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';

interface DerivativeCalculatorProps {
  onComplete?: () => void;
}

export function DerivativeCalculator({ onComplete }: DerivativeCalculatorProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [functionInput, setFunctionInput] = useState('x^2');
  const [derivative, setDerivative] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

  const simpleDerivatives: { [key: string]: string } = {
    'x^2': '2x',
    'x^3': '3x^2',
    'x^4': '4x^3',
    '2x': '2',
    '3x^2': '6x',
    'sin(x)': 'cos(x)',
    'cos(x)': '-sin(x)',
    'e^x': 'e^x',
    'ln(x)': '1/x'
  };

  const calculateDerivative = (func: string): string => {
    return simpleDerivatives[func] || 'Not supported yet';
  };

  const handleCheck = () => {
    const correctAnswer = calculateDerivative(functionInput);
    const isAnswerCorrect = userAnswer.toLowerCase().replace(/\s/g, '') === correctAnswer.toLowerCase().replace(/\s/g, '');
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect && onComplete) {
      onComplete();
    }
  };

  const generateRandomFunction = () => {
    const functions = Object.keys(simpleDerivatives);
    const randomFunc = functions[Math.floor(Math.random() * functions.length)];
    setFunctionInput(randomFunc);
    setDerivative(calculateDerivative(randomFunc));
    setUserAnswer('');
    setIsCorrect(null);
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <span className="mr-2">🧮</span> Derivative Calculator
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Practice computing derivatives using the power rule and basic rules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className={`${themeClasses.text}`}>Function: f(x) = {functionInput}</Label>
          <div className="flex space-x-2">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter the derivative..."
              className={`${themeClasses.text} bg-white/10 border ${themeClasses.border} rounded px-3 py-2`}
            />
            <Button onClick={handleCheck} className="bg-blue-500 hover:bg-blue-600">
              Check
            </Button>
          </div>
        </div>

        {isCorrect !== null && (
          <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isCorrect ? '✅ Correct!' : `❌ Incorrect. The derivative is: ${derivative}`}
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={generateRandomFunction} variant="outline" className={`${themeClasses.border}`}>
            New Function
          </Button>
          <Button onClick={() => setDerivative(calculateDerivative(functionInput))} variant="outline" className={`${themeClasses.border}`}>
            Show Answer
          </Button>
        </div>

        <div className={`text-sm ${themeClasses.text}/70`}>
          <p><strong>Supported functions:</strong> x², x³, x⁴, 2x, 3x², sin(x), cos(x), eˣ, ln(x)</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface GradientVisualizerProps {
  onComplete?: () => void;
}

export function GradientVisualizer({ onComplete }: GradientVisualizerProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Simple gradient visualization
    const drawGradientFlow = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw network nodes
      const nodes = [
        { x: 50, y: 100, label: 'Input' },
        { x: 150, y: 80, label: 'Hidden 1' },
        { x: 150, y: 120, label: 'Hidden 2' },
        { x: 250, y: 100, label: 'Output' }
      ];

      // Draw connections with gradient arrows
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[1].x, nodes[1].y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[2].x, nodes[2].y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(nodes[2].x, nodes[2].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.stroke();

      // Draw nodes
      nodes.forEach(node => {
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 4);
      });

      // Draw gradient flow animation
      if (isAnimating) {
        const time = Date.now() * 0.001;
        const gradientX = 250 + Math.sin(time) * 20;
        const gradientY = 100 + Math.cos(time) * 10;
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(gradientX, gradientY, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    };

    drawGradientFlow();
  }, [isAnimating]);

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <span className="mr-2">🌊</span> Gradient Flow Visualizer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Watch how gradients flow backward through a neural network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="border rounded-lg"
          />
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            className={isAnimating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
          >
            {isAnimating ? 'Stop Animation' : 'Start Animation'}
          </Button>
          {onComplete && (
            <Button onClick={onComplete} className="bg-blue-500 hover:bg-blue-600">
              Complete
            </Button>
          )}
        </div>

        <div className={`text-sm ${themeClasses.text}/70`}>
          <p>The red dot shows how gradients flow backward through the network during backpropagation.</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface NeuralNetworkBuilderProps {
  onComplete?: () => void;
}

export function NeuralNetworkBuilder({ onComplete }: NeuralNetworkBuilderProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [layers, setLayers] = useState([2, 3, 1]);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  const addLayer = () => {
    setLayers([...layers, 2]);
  };

  const removeLayer = (index: number) => {
    if (layers.length > 2) {
      setLayers(layers.filter((_, i) => i !== index));
    }
  };

  const updateLayerSize = (index: number, size: number) => {
    const newLayers = [...layers];
    newLayers[index] = Math.max(1, size);
    setLayers(newLayers);
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <span className="mr-2">🏗️</span> Neural Network Builder
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Build and visualize simple neural networks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className={`${themeClasses.text}`}>Network Architecture</Label>
          <div className="flex items-center space-x-2 flex-wrap">
            {layers.map((size, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div className={`p-2 rounded ${selectedLayer === index ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  <Input
                    type="number"
                    value={size}
                    onChange={(e) => updateLayerSize(index, parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                    min="1"
                    max="10"
                  />
                </div>
                {index < layers.length - 1 && <span className={`${themeClasses.text}`}>→</span>}
                {layers.length > 2 && (
                  <Button
                    onClick={() => removeLayer(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={addLayer} variant="outline" className={`${themeClasses.border}`}>
            Add Layer
          </Button>
          {onComplete && (
            <Button onClick={onComplete} className="bg-blue-500 hover:bg-blue-600">
              Complete
            </Button>
          )}
        </div>

        <div className={`text-sm ${themeClasses.text}/70`}>
          <p><strong>Total parameters:</strong> {layers.reduce((acc, size, i) => {
            if (i === 0) return 0;
            return acc + (layers[i-1] * size);
          }, 0)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface BackpropSimulatorProps {
  onComplete?: () => void;
}

export function BackpropSimulator({ onComplete }: BackpropSimulatorProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [step, setStep] = useState(0);
  const [weights, setWeights] = useState([0.5, -0.3]);
  const [input, setInput] = useState([1, 0.5]);
  const [target, setTarget] = useState(1);
  const [learningRate, setLearningRate] = useState(0.1);

  const forwardPass = () => {
    const output = input[0] * weights[0] + input[1] * weights[1];
    return output;
  };

  const computeLoss = () => {
    const output = forwardPass();
    return Math.pow(output - target, 2);
  };

  const computeGradients = () => {
    const output = forwardPass();
    const error = output - target;
    return [
      2 * error * input[0],
      2 * error * input[1]
    ];
  };

  const updateWeights = () => {
    const gradients = computeGradients();
    setWeights([
      weights[0] - learningRate * gradients[0],
      weights[1] - learningRate * gradients[1]
    ]);
    setStep(step + 1);
  };

  const reset = () => {
    setWeights([0.5, -0.3]);
    setStep(0);
  };

  const output = forwardPass();
  const loss = computeLoss();
  const gradients = computeGradients();

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <span className="mr-2">⚙️</span> Backpropagation Simulator
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Step through backpropagation with a simple 2-input network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className={`${themeClasses.text}`}>Input</Label>
            <div className="space-y-1">
              <Input
                type="number"
                value={input[0]}
                onChange={(e) => setInput([parseFloat(e.target.value) || 0, input[1]])}
                step="0.1"
              />
              <Input
                type="number"
                value={input[1]}
                onChange={(e) => setInput([input[0], parseFloat(e.target.value) || 0])}
                step="0.1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className={`${themeClasses.text}`}>Weights</Label>
            <div className="space-y-1">
              <Input
                type="number"
                value={weights[0].toFixed(3)}
                readOnly
                className="bg-gray-100"
              />
              <Input
                type="number"
                value={weights[1].toFixed(3)}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className={`${themeClasses.text}`}>Target Output</Label>
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <Label className={`${themeClasses.text}`}>Learning Rate</Label>
          <Input
            type="number"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.1)}
            step="0.01"
            min="0.001"
            max="1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className={`${themeClasses.text}/70`}>Output: <span className={`${themeClasses.text} font-mono`}>{output.toFixed(3)}</span></p>
            <p className={`${themeClasses.text}/70`}>Loss: <span className={`${themeClasses.text} font-mono`}>{loss.toFixed(3)}</span></p>
          </div>
          <div>
            <p className={`${themeClasses.text}/70`}>Gradients:</p>
            <p className={`${themeClasses.text} font-mono text-xs`}>w1: {gradients[0].toFixed(3)}</p>
            <p className={`${themeClasses.text} font-mono text-xs`}>w2: {gradients[1].toFixed(3)}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={updateWeights} className="bg-blue-500 hover:bg-blue-600">
            Step Forward
          </Button>
          <Button onClick={reset} variant="outline" className={`${themeClasses.border}`}>
            Reset
          </Button>
          {onComplete && (
            <Button onClick={onComplete} className="bg-green-500 hover:bg-green-600">
              Complete
            </Button>
          )}
        </div>

        <div className={`text-xs ${themeClasses.text}/70`}>
          <p>Step {step}: Watch how the weights change to minimize the loss!</p>
        </div>
      </CardContent>
    </Card>
  );
}