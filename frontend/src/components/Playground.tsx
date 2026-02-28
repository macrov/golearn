import { useState, useEffect } from 'react';
import './Playground.css';

// Predefined code examples
const examples: Record<string, { code: string; wasm: string }> = {
  hello: {
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    wasm: '/hello.wasm'
  },
  fibonacci: {
    code: `package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    for i := 0; i < 10; i++ {
        fmt.Printf("fibonacci(%d) = %d\\n", i, fibonacci(i))
    }
}`,
    wasm: '/fibonacci.wasm'
  },
  loop: {
    code: `package main

import "fmt"

func main() {
    for i := 1; i <= 5; i++ {
        fmt.Printf("Count: %d\\n", i)
    }
    fmt.Println("Done!")
}`,
    wasm: '/loop.wasm'
  }
};

interface PlaygroundProps {
  initialCode?: string;
  onOutput?: (output: string) => void;  // 输出回调
}

export function Playground({ initialCode, onOutput }: PlaygroundProps) {
  const [selectedExample, setSelectedExample] = useState('hello');
  const [code, setCode] = useState(initialCode || examples.hello.code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  // Sync initialCode changes
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const example = e.target.value;
    setSelectedExample(example);
    setCode(examples[example].code);
    setOutput('');
    setError('');
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');

    try {
      // Load the WASM file
      const wasmPath = examples[selectedExample].wasm;
      const response = await fetch(wasmPath);

      if (!response.ok) {
        throw new Error(`Failed to load WASM file: ${response.statusText}`);
      }

      const wasmBytes = await response.arrayBuffer();

      // Check if Go is available
      if (!(window as any).Go) {
        throw new Error('Go WASM runtime not loaded. Please refresh the page.');
      }

      const Go = (window as any).Go;

      // Create a new Go instance
      const stdoutLines: string[] = [];
      const go = new Go({
        stdout: (data: string) => {
          stdoutLines.push(data);
          const fullOutput = stdoutLines.join('');
          setOutput(fullOutput);
          // 回调通知父组件
          if (onOutput) {
            onOutput(fullOutput);
          }
        },
        stderr: (data: string) => {
          stdoutLines.push(data);
          const fullOutput = stdoutLines.join('');
          setOutput(fullOutput);
          if (onOutput) {
            onOutput(fullOutput);
          }
        }
      });

      // Instantiate and run the WASM
      const { instance } = await WebAssembly.instantiate(wasmBytes, go.importObject);
      go.run(instance);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      if (onOutput) {
        onOutput('ERROR: ' + errorMsg);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="playground">
      <div className="playground-header">
        <h3 className="playground-title">Go Playground</h3>
        <select
          className="example-select"
          value={selectedExample}
          onChange={handleExampleChange}
        >
          <option value="hello">Hello World</option>
          <option value="fibonacci">Fibonacci</option>
          <option value="loop">Loop</option>
        </select>
      </div>

      <textarea
        className="playground-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />

      <div className="playground-controls">
        <button
          className="run-button"
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <div className="spinner" />
              Running...
            </>
          ) : (
            '▶ 运行'
          )}
        </button>
      </div>

      {(output || error) && (
        <div>
          <div className="output-label">输出:</div>
          <div className="playground-output">
            {error ? <span className="error">{error}</span> : output}
          </div>
        </div>
      )}
    </div>
  );
}
