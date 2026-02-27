import type { Lesson } from '../types/course';
import { LessonItem } from './LessonItem';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string | null;
  completedLessons: Set<string>;
  isOpen: boolean;
  onToggle: () => void;
  onLessonClick: (lessonId: string) => void;
}

export function LessonSidebar({
  lessons,
  currentLessonId,
  completedLessons,
  isOpen,
  onToggle,
  onLessonClick,
}: LessonSidebarProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg shadow-md"
        aria-label="Open sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Lessons</h2>
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 p-1"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            isActive={lesson.id === currentLessonId}
            isCompleted={completedLessons.has(lesson.id)}
            onClick={() => onLessonClick(lesson.id)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Progress</span>
          <span>{completedLessons.size} / {lessons.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
