"use client";

import React, { useState, useEffect, useRef } from "react";

interface PyodideRunnerProps {
  starterCode: string;
  solution: string;
  onRun?: (output: string, error?: string) => void;
  onComplete?: () => void;
  hints?: string[];
}

export default function PyodideRunner({ 
  starterCode, 
  solution, 
  onRun, 
  onComplete, 
  hints = [] 
}: PyodideRunnerProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [pyodide, setPyodide] = useState<unknown>(null);
  const [isLoaded, setIsLoaded] = useState(false);
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
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        setOutput("Error: Failed to load Python environment. Please refresh the page.");
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
    setOutput("Running...");

    try {
      // Clear previous output
      pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
        sys.stderr = StringIO()
      `);

      // Run the user's code
      const result = pyodide.runPython(code);
      
      // Capture output
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      const stderr = pyodide.runPython("sys.stderr.getvalue()");
      
      const outputText = stdout || stderr || "Code executed successfully!";
      setOutput(outputText);
      
      if (onRun) {
        onRun(outputText, stderr || undefined);
      }

      // Check if solution is complete
      if (code.includes("___") || code.includes("TODO")) {
        setOutput(outputText + "\n\n💡 Hint: Complete the TODO items marked with ___");
      } else {
        setOutput(outputText + "\n\n✅ Great job! Your code is complete.");
        if (onComplete) {
          onComplete();
        }
      }

    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || "An error occurred while running your code.";
      setOutput(`Error: ${errorMessage}`);
      
      if (onRun) {
        onRun("", errorMessage);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const showSolution = () => {
    setCode(solution);
    setOutput("Solution loaded! Try running it to see how it works.");
  };

  const resetCode = () => {
    setCode(starterCode);
    setOutput("");
  };

  const scrollToOutput = () => {
    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
          <h3 className="font-semibold text-sm">Python Code Editor</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              {showHints ? "Hide" : "Show"} Hints
            </button>
            <button
              onClick={showSolution}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Show Solution
            </button>
            <button
              onClick={resetCode}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-4 font-mono text-sm border-0 resize-none focus:outline-none"
          placeholder="Write your Python code here..."
          spellCheck={false}
        />
      </div>

      {/* Hints */}
      {showHints && hints.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Hints:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {hints.map((hint, index) => (
              <li key={index}>• {hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Run Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={runCode}
          disabled={isRunning || !isLoaded}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? "Running..." : isLoaded ? "Run Code" : "Loading Python..."}
        </button>
        
        {output && (
          <button
            onClick={scrollToOutput}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ↓ View Output
          </button>
        )}
      </div>

      {/* Output */}
      {output && (
        <div ref={outputRef} className="border rounded-lg">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="font-semibold text-sm">Output</h3>
          </div>
          <pre className="p-4 text-sm bg-gray-900 text-green-400 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      {/* Status */}
      <div className="text-xs text-gray-500">
        {isLoaded ? (
          "✅ Python environment ready"
        ) : (
          "⏳ Loading Python environment..."
        )}
      </div>
    </div>
  );
}
