import { useState, useEffect } from 'react';
import './Playground.css';

interface PlaygroundProps {
  initialCode?: string;
  onOutput?: (output: string) => void;
}

export function Playground({ initialCode, onOutput }: PlaygroundProps) {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  // Sync initialCode changes
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const runCode = async () => {
    if (!code.trim()) {
      setError('请输入代码');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch('https://golearn-api.backfire-ghw.workers.dev/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        if (onOutput) {
          onOutput('ERROR: ' + result.error);
        }
      } else {
        setOutput(result.output);
        if (onOutput) {
          onOutput(result.output);
        }
      }
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

  const clearOutput = () => {
    setOutput('');
    setError('');
    if (onOutput) {
      onOutput('');
    }
  };

  return (
    <div className="playground">
      <div className="playground-header">
        <h3 className="playground-title">Go Playground</h3>
        <div className="playground-actions">
          <button
            className="clear-button"
            onClick={clearOutput}
            disabled={!output && !error}
          >
            清空输出
          </button>
        </div>
      </div>

      <textarea
        className="playground-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        placeholder="在此输入 Go 代码..."
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
              编译运行中...
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
            {error ? <span className="error">{error}</span> : <pre>{output}</pre>}
          </div>
        </div>
      )}
    </div>
  );
}
