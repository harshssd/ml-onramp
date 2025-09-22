'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Zap, RotateCcw, CheckCircle, Target } from 'lucide-react';

interface ClusteringVisualizerWidgetProps {
  onComplete?: () => void;
}

interface DataPoint {
  x: number;
  y: number;
  cluster: number;
  originalCluster: number;
}

export default function ClusteringVisualizerWidget({ onComplete }: ClusteringVisualizerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [numClusters, setNumClusters] = useState([3]);
  const [isClustering, setIsClustering] = useState(false);
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // Generate sample data with natural clusters
  const generateData = () => {
    const points: DataPoint[] = [];
    
    // Create 3 natural clusters
    const clusters = [
      { centerX: 20, centerY: 20, count: 15 },
      { centerX: 60, centerY: 30, count: 15 },
      { centerX: 40, centerY: 70, count: 15 }
    ];
    
    clusters.forEach((cluster, clusterIndex) => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 15;
        const x = cluster.centerX + Math.cos(angle) * radius;
        const y = cluster.centerY + Math.sin(angle) * radius;
        
        points.push({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
          cluster: clusterIndex,
          originalCluster: clusterIndex
        });
      }
    });
    
    setDataPoints(points);
  };

  useEffect(() => {
    generateData();
  }, []);

  // K-means clustering algorithm
  const performClustering = async () => {
    setIsClustering(true);
    
    const k = numClusters[0];
    const points = [...dataPoints];
    
    // Initialize centroids randomly
    const centroids = Array.from({ length: k }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    
    // Perform iterations
    for (let iteration = 0; iteration < 10; iteration++) {
      // Assign points to nearest centroid
      const updatedPoints = points.map(point => {
        let minDistance = Infinity;
        let closestCluster = 0;
        
        centroids.forEach((centroid, index) => {
          const distance = Math.sqrt(
            Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestCluster = index;
          }
        });
        
        return { ...point, cluster: closestCluster };
      });
      
      setDataPoints(updatedPoints);
      
      // Update centroids
      for (let i = 0; i < k; i++) {
        const clusterPoints = updatedPoints.filter(p => p.cluster === i);
        if (clusterPoints.length > 0) {
          centroids[i] = {
            x: clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length,
            y: clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length
          };
        }
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsClustering(false);
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
      
      ctx.fillStyle = colors[point.cluster % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = themeClasses.background;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
  }, [dataPoints, themeClasses.background, themeClasses.border]);

  const calculateClusterQuality = () => {
    if (dataPoints.length === 0) return 0;
    
    // Calculate silhouette-like score (simplified)
    let totalScore = 0;
    dataPoints.forEach(point => {
      const sameCluster = dataPoints.filter(p => p.cluster === point.cluster && p !== point);
      const differentClusters = dataPoints.filter(p => p.cluster !== point.cluster);
      
      if (sameCluster.length > 0 && differentClusters.length > 0) {
        const avgSameDistance = sameCluster.reduce((sum, p) => {
          const dist = Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2));
          return sum + dist;
        }, 0) / sameCluster.length;
        
        const avgDiffDistance = differentClusters.reduce((sum, p) => {
          const dist = Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2));
          return sum + dist;
        }, 0) / differentClusters.length;
        
        const score = (avgDiffDistance - avgSameDistance) / Math.max(avgDiffDistance, avgSameDistance);
        totalScore += Math.max(0, score);
      }
    });
    
    return Math.round((totalScore / dataPoints.length) * 100);
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const clusterQuality = calculateClusterQuality();

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Clustering Visualizer
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Discover hidden groups in data without labels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>How Clustering Works:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• <strong>No Labels:</strong> Unlike classification, clustering finds groups without knowing the answers</li>
            <li>• <strong>Similarity:</strong> Points that are close together are grouped together</li>
            <li>• <strong>K-means:</strong> Algorithm that finds k clusters by iteratively updating cluster centers</li>
            <li>• <strong>Unsupervised:</strong> The machine discovers patterns on its own</li>
          </ul>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Number of Clusters: {numClusters[0]}
            </label>
            <Slider
              value={numClusters}
              onValueChange={setNumClusters}
              max={6}
              min={2}
              step={1}
              className="w-full"
              disabled={isClustering}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2</span>
              <span>4</span>
              <span>6</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={performClustering}
              disabled={isClustering}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isClustering ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Clustering...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Find Clusters
                </>
              )}
            </Button>
            <Button
              onClick={generateData}
              variant="outline"
              className={`${themeClasses.border}`}
              disabled={isClustering}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Data
            </Button>
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Data Clustering Visualization</h4>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={500}
              height={400}
              className="border rounded-lg bg-white dark:bg-gray-900"
            />
            <div className="absolute top-2 right-2 text-xs">
              <div className={`${themeClasses.text}/70`}>
                {dataPoints.length} points, {numClusters[0]} clusters
              </div>
            </div>
          </div>
        </div>

        {/* Cluster Quality */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Cluster Quality</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{clusterQuality}%</div>
              <div className={`text-sm ${themeClasses.text}/70`}>Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{numClusters[0]}</div>
              <div className={`text-sm ${themeClasses.text}/70`}>Clusters Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{dataPoints.length}</div>
              <div className={`text-sm ${themeClasses.text}/70`}>Data Points</div>
            </div>
          </div>
        </div>

        {/* Real-world Examples */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Real-world Applications</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Customer Segmentation:</strong> Group customers by behavior for targeted marketing
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Gene Analysis:</strong> Find groups of similar genes in biological research
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Image Organization:</strong> Automatically group similar photos
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
              I Understand Clustering
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
              You now understand how clustering works! This unsupervised learning technique 
              helps discover hidden patterns in data without needing labels.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
