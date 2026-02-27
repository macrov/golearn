import type { Lesson } from '../types/course';
import ReactMarkdown from 'react-markdown';

interface LessonContentProps {
  lesson: Lesson;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export function LessonContent({ lesson, hasNext, hasPrevious, onNext, onPrevious }: LessonContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{lesson.title}</h1>
        <div className="prose prose-blue max-w-none">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      </div>

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
          Previous
        </button>

        <span className="text-sm text-gray-500">Lesson {lesson.order}</span>

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
          Next
        </button>
      </div>
    </div>
  );
}
