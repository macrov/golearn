import { useState } from 'react';
import type { Lesson } from '../types/course';
import ReactMarkdown from 'react-markdown';

interface LessonContentProps {
  lesson: Lesson;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  userOutput?: string;  // 用户运行代码的输出
}

export function LessonContent({ 
  lesson, 
  hasNext, 
  hasPrevious, 
  onNext, 
  onPrevious,
  userOutput 
}: LessonContentProps) {
  const [showHints, setShowHints] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // 解析 hints（可能是 JSON 字符串或数组）
  const hints = Array.isArray(lesson.hints) 
    ? lesson.hints 
    : (typeof lesson.hints === 'string' && lesson.hints ? JSON.parse(lesson.hints) : []);

  // 对比用户输出和预期输出
  const compareOutput = () => {
    if (!userOutput || !lesson.expected_output) return null;
    
    const normalizedUser = userOutput.trim();
    const normalizedExpected = lesson.expected_output.trim();
    
    if (normalizedUser === normalizedExpected) {
      return { success: true, message: '✅ 正确！输出匹配预期结果。' };
    } else {
      return { 
        success: false, 
        message: '❌ 输出不匹配，请检查你的代码。' 
      };
    }
  };

  const comparison = compareOutput();

  const handleNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{lesson.title}</h1>
        
        {/* 课程内容 */}
        <div className="prose prose-blue max-w-none mb-6">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>

        {/* 提示/答案区域 */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">需要帮助？</h3>
          
          {/* 提示按钮 */}
          {hints.length > 0 && (
            <div className="mb-4">
              {!showHints ? (
                <button
                  onClick={() => setShowHints(true)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  💡 显示提示 ({hints.length})
                </button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-yellow-800 font-medium">
                      提示 {currentHintIndex + 1}/{hints.length}
                    </span>
                    <div className="flex gap-2">
                      {hints.length > 1 && currentHintIndex > 0 && (
                        <button
                          onClick={() => setCurrentHintIndex(currentHintIndex - 1)}
                          className="text-sm text-yellow-600 hover:text-yellow-800"
                        >
                          ← 上一个
                        </button>
                      )}
                      {hints.length > 1 && currentHintIndex < hints.length - 1 && (
                        <button
                          onClick={handleNextHint}
                          className="text-sm text-yellow-600 hover:text-yellow-800"
                        >
                          下一个 →
                        </button>
                      )}
                      <button
                        onClick={() => setShowHints(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        隐藏
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{hints[currentHintIndex]}</p>
                </div>
              )}
            </div>
          )}

          {/* 答案按钮 */}
          {lesson.expected_output && (
            <div className="mb-4">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  🔍 显示预期输出
                </button>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-blue-800 font-medium">预期输出</span>
                    <button
                      onClick={() => setShowAnswer(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      隐藏
                    </button>
                  </div>
                  <pre className="bg-white p-3 rounded border border-blue-200 text-sm font-mono whitespace-pre-wrap">
                    {lesson.expected_output}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* 输出对比结果 */}
          {comparison && (
            <div className={`p-4 rounded-lg ${comparison.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={comparison.success ? 'text-green-800' : 'text-red-800'}>
                {comparison.message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-white">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${hasPrevious
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          上一课
        </button>

        <span className="text-sm text-gray-500">课时 {lesson.order}</span>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${hasNext
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          下一课
        </button>
      </div>
    </div>
  );
}
