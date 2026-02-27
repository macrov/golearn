import type { Lesson } from '../types/course';

interface LessonItemProps {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export function LessonItem({ lesson, isActive, isCompleted, onClick }: LessonItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-100
        transition-colors duration-150
        ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}
      `}
    >
      <span className="flex-shrink-0 w-6 text-center">
        {isCompleted ? (
          <span className="text-green-600 font-semibold">✓</span>
        ) : isActive ? (
          <span className="text-blue-600 font-semibold">●</span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
          {lesson.order}. {lesson.title}
        </div>
        {lesson.description && (
          <div className="text-xs text-gray-500 truncate mt-0.5">{lesson.description}</div>
        )}
      </div>
    </button>
  );
}
