'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';

type Point = { x: number; y: number };

function generateData(n = 50, trueM = 1.6, trueB = 2, noise = 1.1): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 10; // [0,10]
    const y = trueM * x + trueB + (Math.random() * 2 - 1) * noise;
    points.push({ x, y });
  }
  return points;
}

function mse(points: Point[], m: number, b: number) {
  return (
    points.reduce((acc, p) => acc + Math.pow(p.y - (m * p.x + b), 2), 0) / points.length
  );
}

interface RegressionPlaygroundProps {
  onComplete?: () => void;
  showTrueLine?: boolean;
  showMSE?: boolean;
  interactive?: boolean;
}

export default function RegressionPlayground({ 
  onComplete, 
  showTrueLine = true, 
  showMSE = true,
  interactive = true 
}: RegressionPlaygroundProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [m, setM] = useState(1.0);
  const [b, setB] = useState(0.0);
  const [pts] = useState(() => generateData());
  const [showInstructions, setShowInstructions] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const error = useMemo(() => mse(pts, m, b), [pts, m, b]);
  const trueM = 1.6;
  const trueB = 2;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    
    const ctx = c.getContext('2d')!;
    const w = c.width, h = c.height;
    
    // Scale helpers
    const xMax = 10;
    const yMax = Math.max(...pts.map(p => p.y), m * xMax + b, trueM * xMax + trueB) + 2;
    const yMin = Math.min(...pts.map(p => p.y), m * 0 + b, trueM * 0 + trueB) - 2;
    const xToPx = (x: number) => (x / xMax) * (w - 40) + 30;
    const yToPx = (y: number) => h - ((y - yMin) / (yMax - yMin)) * (h - 40) - 20;
    
    // Clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = xToPx(i);
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - 20);
      ctx.stroke();
    }
    
    for (let i = 0; i <= 10; i++) {
      const y = yToPx(yMin + (i / 10) * (yMax - yMin));
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }
    
    // Draw data points
    ctx.fillStyle = '#3b82f6';
    pts.forEach(p => {
      const x = xToPx(p.x);
      const y = yToPx(p.y);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw true line (if enabled)
    if (showTrueLine) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xToPx(0), yToPx(trueM * 0 + trueB));
      ctx.lineTo(xToPx(10), yToPx(trueM * 10 + trueB));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw current line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xToPx(0), yToPx(m * 0 + b));
    ctx.lineTo(xToPx(10), yToPx(m * 10 + b));
    ctx.stroke();
    
    // Draw axes labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x', w / 2, h - 5);
    ctx.textAlign = 'right';
    ctx.fillText('y', 25, h / 2);
    
    // Draw slope and intercept labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Slope (m): ${m.toFixed(2)}`, 10, 20);
    ctx.fillText(`Intercept (b): ${b.toFixed(2)}`, 10, 40);
    
    if (showMSE) {
      ctx.fillText(`MSE: ${error.toFixed(2)}`, 10, 60);
    }
    
    if (showTrueLine) {
      ctx.fillStyle = '#10b981';
      ctx.fillText(`True: m=${trueM}, b=${trueB}`, 10, 80);
    }
  }, [pts, m, b, error, showTrueLine, showMSE]);

  const resetToRandom = () => {
    setM(Math.random() * 3 - 1); // -1 to 2
    setB(Math.random() * 4 - 2); // -2 to 2
  };

  const resetToTrue = () => {
    setM(trueM);
    setB(trueB);
  };

  const generateNewData = () => {
    window.location.reload(); // Simple way to regenerate data
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <span className="mr-2">📈</span> Regression Playground
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Adjust the line to fit the data points. See how slope and intercept affect the fit!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showInstructions && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/20')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Instructions:</h4>
            <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
              <li>• Use the sliders to adjust the slope (m) and intercept (b)</li>
              <li>• Try to make the red line fit the blue data points as closely as possible</li>
              <li>• Watch how the MSE (Mean Squared Error) changes as you adjust the line</li>
              <li>• The green dashed line shows the "true" relationship (if enabled)</li>
            </ul>
            <Button 
              onClick={() => setShowInstructions(false)}
              size="sm" 
              variant="outline" 
              className="mt-2"
            >
              Got it!
            </Button>
          </div>
        )}

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border rounded-lg bg-white"
          />
        </div>

        {interactive && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${themeClasses.text}`}>
                  Slope (m): {m.toFixed(2)}
                </label>
                <Slider
                  value={[m]}
                  onValueChange={([value]) => setM(value)}
                  min={-2}
                  max={4}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className={`text-sm font-medium ${themeClasses.text}`}>
                  Intercept (b): {b.toFixed(2)}
                </label>
                <Slider
                  value={[b]}
                  onValueChange={([value]) => setB(value)}
                  min={-3}
                  max={5}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={resetToRandom} variant="outline" className={`${themeClasses.border}`}>
                Random Start
              </Button>
              <Button onClick={resetToTrue} variant="outline" className={`${themeClasses.border}`}>
                Perfect Fit
              </Button>
              <Button onClick={generateNewData} variant="outline" className={`${themeClasses.border}`}>
                New Data
              </Button>
            </div>
          </div>
        )}

        <div className={`text-sm ${themeClasses.text}/70`}>
          <p><strong>What you're learning:</strong> This is exactly how neural networks work! They adjust their parameters (like slope and intercept) to minimize error on data. The process of finding the best parameters is called "training" or "learning".</p>
        </div>

        {onComplete && (
          <div className="text-center">
            <Button 
              onClick={onComplete} 
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              Complete Exercise
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}