"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Play, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";

interface PyodideRunnerProps {
  code: string;
  onStdout: (output: string) => void;
  onRunStart?: () => void;
  onRunComplete?: () => void;
}

export default function PyodideRunner({ 
  code, 
  onStdout, 
  onRunStart,
  onRunComplete
}: PyodideRunnerProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pyodide, setPyodide] = useState<any>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Load Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        // @ts-expect-error - Pyodide types not available
        const pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        setPyodide(pyodide);
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Failed to load Pyodide:", err);
        setError("Failed to load Python environment. Please refresh the page.");
      }
    };

    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide || !isLoaded) {
      setOutput("Python environment is still loading...");
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput("Running machine learning pipeline...");
    
    if (onRunStart) {
      onRunStart();
    }

    try {
      // Clear previous output
      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
        sys.stderr = StringIO()
      `);

      // Run the code
      pyodide.runPython(code);
      
      // Capture output
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      const stderr = pyodide.runPython("sys.stderr.getvalue()");
      
      const outputText = stdout || stderr || "Code executed successfully!";
      setOutput(outputText);
      
      // Send output to parent
      onStdout(outputText);
      
      if (onRunComplete) {
        onRunComplete();
      }

    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || "An error occurred while running the code.";
      setError(errorMessage);
      setOutput(`Error: ${errorMessage}`);
      
      if (onRunComplete) {
        onRunComplete();
      }
    } finally {
      setIsRunning(false);
    }
  };

  const resetOutput = () => {
    setOutput("");
    setError(null);
  };

  const scrollToOutput = () => {
    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Run Button */}
      <div className="flex justify-between items-center">
        <Button
          onClick={runCode}
          disabled={isRunning || !isLoaded}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Running...
            </>
          ) : isLoaded ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Train & Evaluate Models
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Loading Python...
            </>
          )}
        </Button>
        
        {output && (
          <Button
            onClick={scrollToOutput}
            variant="outline"
            className={themeClasses.border}
          >
            ↓ View Output
          </Button>
        )}
      </div>

      {/* Status */}
      <div className={`text-sm ${themeClasses.text}/70`}>
        {isLoaded ? (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Python environment ready</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            <span>Loading Python environment...</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={`p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800`}>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className={`font-medium ${themeClasses.text}`}>Error</span>
          </div>
          <p className={`text-sm ${themeClasses.text}/80 mt-1`}>{error}</p>
        </div>
      )}

      {/* Output */}
      {output && (
        <div ref={outputRef} className={`border rounded-lg ${themeClasses.border}`}>
          <div className={`px-4 py-2 border-b ${themeClasses.border} flex justify-between items-center`}>
            <h3 className={`font-semibold text-sm ${themeClasses.text}`}>Execution Output</h3>
            <Button
              onClick={resetOutput}
              variant="outline"
              size="sm"
              className={themeClasses.border}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
          <pre className={`p-4 text-sm bg-gray-900 text-green-400 overflow-x-auto whitespace-pre-wrap font-mono`}>
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
        <h4 className={`font-medium ${themeClasses.text} mb-2`}>What's happening?</h4>
        <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
          <li>• Loading Iris dataset and splitting into train/test sets</li>
          <li>• Training KNN classifier with k=5 neighbors</li>
          <li>• Training Softmax Regression with gradient descent</li>
          <li>• Computing precision, recall, F1, and ROC curves</li>
          <li>• Generating confusion matrices for both models</li>
        </ul>
      </div>
    </div>
  );
}
