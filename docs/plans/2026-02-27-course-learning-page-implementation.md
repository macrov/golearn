# Course Learning Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a course learning page with lesson content sidebar, markdown rendering, and integrated Go playground.

**Architecture:** Three-column responsive layout (sidebar | content | playground) with URL-driven state management via react-router query params.

**Tech Stack:** React, TypeScript, Tailwind CSS, react-markdown, react-router-dom

---

## Task 1: Install react-markdown dependency

**Files:**
- Modify: `frontend/package.json`

**Step 1: Install react-markdown**

Run: `cd frontend && npm install react-markdown`

Expected: Package installed successfully, `react-markdown` added to package.json dependencies

**Step 2: Commit**

```bash
cd frontend
git add package.json package-lock.json
git commit -m "chore: install react-markdown for lesson content rendering"
```

---

## Task 2: Extend API with getCourseDetail and getLesson methods

**Files:**
- Modify: `frontend/src/api/courses.ts`

**Step 1: Add getCourseDetail method to coursesApi**

```typescript
// Add after getById method:
getCourseDetail: async (id: string): Promise<CourseDetail> => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course details');
  }
  return response.json();
},
```

**Step 2: Add getLesson method to coursesApi**

```typescript
// Add after getCourseDetail method:
getLesson: async (courseId: string, lessonId: string): Promise<Lesson> => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lesson');
  }
  return response.json();
},
```

**Step 3: Add imports for CourseDetail and Lesson**

```typescript
// At top of file, add to imports:
import { Course, CourseDetail, Lesson } from '../types/course';
```

**Step 4: Commit**

```bash
git add frontend/src/api/courses.ts
git commit -m "feat: add getCourseDetail and getLesson API methods"
```

---

## Task 3: Enhance Playground component with initialCode prop

**Files:**
- Modify: `frontend/src/components/Playground.tsx`

**Step 1: Add initialCode prop to Playground component**

```typescript
// Replace component signature:
interface PlaygroundProps {
  initialCode?: string;
}

export function Playground({ initialCode }: PlaygroundProps = {}) {
```

**Step 2: Initialize code state with initialCode if provided**

```typescript
// Replace useState initialization:
const [code, setCode] = useState(initialCode || examples.hello.code);

// Add useEffect to sync initialCode changes:
useEffect(() => {
  if (initialCode) {
    setCode(initialCode);
  }
}, [initialCode]);
```

**Step 3: Commit**

```bash
git add frontend/src/components/Playground.tsx
git commit -m "feat: add initialCode prop to Playground component"
```

---

## Task 4: Create LessonItem component

**Files:**
- Create: `frontend/src/components/LessonItem.tsx`

**Step 1: Create LessonItem component**

```typescript
import { Lesson } from '../types/course';

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
```

**Step 2: Commit**

```bash
git add frontend/src/components/LessonItem.tsx
git commit -m "feat: add LessonItem component with progress indicators"
```

---

## Task 5: Create LessonSidebar component

**Files:**
- Create: `frontend/src/components/LessonSidebar.tsx`

**Step 1: Create LessonSidebar component**

```typescript
import { Lesson } from '../types/course';
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
```

**Step 2: Commit**

```bash
git add frontend/src/components/LessonSidebar.tsx
git commit -m "feat: add LessonSidebar component with progress tracking"
```

---

## Task 6: Create LessonContent component

**Files:**
- Create: `frontend/src/components/LessonContent.tsx`

**Step 1: Create LessonContent component**

```typescript
import { Lesson } from '../types/course';
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
          ← Previous
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
          Next →
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/LessonContent.tsx
git commit -m "feat: add LessonContent component with markdown rendering"
```

---

## Task 7: Update App.tsx route parameter

**Files:**
- Modify: `frontend/src/App.tsx`

**Step 1: Update route parameter from `:id` to `:courseId`**

```tsx
// Replace the course route:
<Route path="/course/:courseId" element={<Course />} />
```

**Step 2: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "refactor: rename route param to courseId for consistency"
```

---

## Task 8: Rewrite Course.tsx with full learning page implementation

**Files:**
- Modify: `frontend/src/pages/Course.tsx`

**Step 1: Replace entire Course.tsx with new implementation**

```typescript
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CourseDetail, Lesson } from '../types/course';
import { coursesApi } from '../api/courses';
import { Playground } from '../components/Playground';
import { LessonSidebar } from '../components/LessonSidebar';
import { LessonContent } from '../components/LessonContent';

export function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const lessonId = searchParams.get('lesson');

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  // Fetch course details on mount
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const courseData = await coursesApi.getCourseDetail(courseId);
        setCourse(courseData);

        // If no lesson specified, redirect to first lesson
        if (!lessonId && courseData.lessons.length > 0) {
          navigate(`?lesson=${courseData.lessons[0].id}`, { replace: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Fetch lesson content when lessonId changes
  useEffect(() => {
    if (!courseId || !lessonId) return;

    const fetchLesson = async () => {
      try {
        setLessonLoading(true);
        const lessonData = await coursesApi.getLesson(courseId, lessonId);
        setCurrentLesson(lessonData);
      } catch (err) {
        console.error('Failed to load lesson:', err);
        // Don't set error state to keep sidebar functional
      } finally {
        setLessonLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  // Navigate to lesson
  const handleLessonClick = (newLessonId: string) => {
    setSearchParams({ lesson: newLessonId });
  };

  // Navigate to previous lesson
  const handlePrevious = () => {
    if (!course || !currentLesson) return;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      handleLessonClick(course.lessons[currentIndex - 1].id);
    }
  };

  // Navigate to next lesson
  const handleNext = () => {
    if (!course || !currentLesson) return;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < course.lessons.length - 1) {
      handleLessonClick(course.lessons[currentIndex + 1].id);
    }
  };

  // Calculate navigation states
  const hasPrevious = course && currentLesson
    ? course.lessons.findIndex(l => l.id === currentLesson.id) > 0
    : false;
  const hasNext = course && currentLesson
    ? course.lessons.findIndex(l => l.id === currentLesson.id) < course.lessons.length - 1
    : false;

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Loading course...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error: {error}</div>
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Course not found</div>
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Empty course (no lessons)
  if (course.lessons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
          ← Back to Courses
        </Link>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">This course has no lessons yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <LessonSidebar
        lessons={course.lessons}
        currentLessonId={lessonId}
        completedLessons={completedLessons}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLessonClick={handleLessonClick}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-blue-500 hover:underline">
            ← Back to Courses
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {lessonLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-600">Loading lesson...</div>
            </div>
          ) : currentLesson ? (
            <LessonContent
              lesson={currentLesson}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-red-500">Failed to load lesson content</div>
            </div>
          )}

          {sidebarOpen && (
            <aside className="w-96 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Playground</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <Playground initialCode={currentLesson?.code} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/pages/Course.tsx
git commit -m "feat: implement course learning page with sidebar and playground"
```

---

## Task 9: Verify implementation and test

**Files:**
- Test: Manual browser testing

**Step 1: Start the backend server**

Run: `go run cmd/server/main.go` (from project root)
Expected: Server running on port 8081

**Step 2: Start the frontend dev server**

Run: `cd frontend && npm run dev`
Expected: Dev server running (typically on port 5173)

**Step 3: Test the learning page**

1. Navigate to `/course/go-basics?lesson=hello-world`
2. Verify:
   - Three-column layout renders (sidebar, content, playground)
   - Lesson title and content display with markdown rendering
   - Playground is pre-loaded with lesson code
   - Previous/Next buttons work and update URL
   - Sidebar toggle collapses/expands
   - Clicking lesson in sidebar navigates to that lesson
   - Progress indicator shows at bottom of sidebar

**Step 4: Test edge cases**

1. Visit `/course/go-basics` (no lesson param) → should redirect to first lesson
2. Visit `/course/invalid-course` → should show "Course not found"
3. Test Previous button on first lesson → should be disabled
4. Test Next button on last lesson → should be disabled

**Step 5: Final commit if fixes needed**

If any adjustments were made:

```bash
git add -A
git commit -m "fix: address issues found during testing"
```

---

## Completion

**Acceptance Criteria Met:**
- ✅ Three-column layout with sidebar, content, and playground
- ✅ Lesson content renders markdown
- ✅ Playground pre-loads with lesson code
- ✅ Previous/Next navigation with URL updates
- ✅ Collapsible sidebar with progress indicators
- ✅ Redirect to first lesson when no lesson param
- ✅ Error handling for invalid courses/lessons
