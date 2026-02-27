# Course Learning Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a course learning page with lesson content (left), code playground (right), and collapsible lesson sidebar with progress tracking.

**Architecture:** Three-column responsive layout. URL-driven state (courseId param, lessonId query). Component hierarchy: Course → LessonSidebar + LessonContent + Playground. Data fetching via expanded coursesApi.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind CSS, react-markdown

---

## Task 1: Install Dependencies

**Files:**
- Modify: `frontend/package.json`

**Step 1: Install react-markdown**

Run: `cd frontend && npm install react-markdown`

Expected output: Package installed successfully

**Step 2: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore: install react-markdown for lesson content rendering"
```

---

## Task 2: Extend Course API Methods

**Files:**
- Modify: `frontend/src/api/courses.ts`

**Step 1: Add CourseDetail and Lesson types to imports**

Read the current types file first to ensure consistency:

```typescript
import { Course, CourseDetail, Lesson } from '../types/course';
```

**Step 2: Add getCourseDetail method**

```typescript
getCourseDetail: async (id: string): Promise<CourseDetail> => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course detail');
  }
  return response.json();
},
```

**Step 3: Add getLesson method**

```typescript
getLesson: async (courseId: string, lessonId: string): Promise<Lesson> => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lesson');
  }
  return response.json();
},
```

**Step 4: Commit**

```bash
git add frontend/src/api/courses.ts
git commit -m "feat: add course detail and lesson API methods"
```

---

## Task 3: Create LessonSidebar Component

**Files:**
- Create: `frontend/src/components/LessonSidebar.tsx`
- Create: `frontend/src/components/LessonSidebar.css`

**Step 1: Create LessonSidebar component**

```tsx
import { useState } from 'react';
import { Lesson } from '../types/course';
import './LessonSidebar.css';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onLessonClick: (lessonId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function LessonSidebar({
  lessons,
  currentLessonId,
  onLessonClick,
  isOpen,
  onToggle,
}: LessonSidebarProps) {
  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {isOpen ? '«' : '»'}
      </button>
      <aside className={`lesson-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h3 className="sidebar-title">Lessons</h3>
        <ul className="lesson-list">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className={`lesson-item ${lesson.id === currentLessonId ? 'active' : ''}`}
              onClick={() => onLessonClick(lesson.id)}
            >
              <span className="lesson-order">{lesson.order}</span>
              <span className="lesson-title">{lesson.title}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
```

**Step 2: Create LessonSidebar styles**

```css
.sidebar-toggle {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 60px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  z-index: 10;
  font-size: 14px;
  transition: left 0.3s ease;
}

.sidebar-toggle.open {
  left: 240px;
}

.lesson-sidebar {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 240px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 5;
}

.lesson-sidebar.closed {
  transform: translateX(-100%);
}

.lesson-sidebar.open {
  transform: translateX(0);
}

.sidebar-title {
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.lesson-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lesson-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-left: 3px solid transparent;
  transition: background-color 0.2s;
}

.lesson-item:hover {
  background-color: #f3f4f6;
}

.lesson-item.active {
  background-color: #eff6ff;
  border-left-color: #3b82f6;
}

.lesson-order {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  min-width: 24px;
}

.lesson-title {
  font-size: 0.875rem;
  color: #1f2937;
}
```

**Step 3: Commit**

```bash
git add frontend/src/components/LessonSidebar.tsx frontend/src/components/LessonSidebar.css
git commit -m "feat: add LessonSidebar component"
```

---

## Task 4: Create LessonContent Component

**Files:**
- Create: `frontend/src/components/LessonContent.tsx`
- Create: `frontend/src/components/LessonContent.css`

**Step 1: Create LessonContent component**

```tsx
import ReactMarkdown from 'react-markdown';
import { Lesson } from '../types/course';
import './LessonContent.css';

interface LessonContentProps {
  lesson: Lesson;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function LessonContent({
  lesson,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
}: LessonContentProps) {
  return (
    <div className="lesson-content">
      <h1 className="lesson-title">{lesson.title}</h1>
      <div className="lesson-body">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>
      <div className="lesson-navigation">
        <button
          className="nav-button prev-button"
          onClick={onPrev}
          disabled={!hasPrev}
        >
          ← Previous Lesson
        </button>
        <button
          className="nav-button next-button"
          onClick={onNext}
          disabled={!hasNext}
        >
          Next Lesson →
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Create LessonContent styles**

```css
.lesson-content {
  padding: 2rem;
  max-width: 100%;
  overflow-y: auto;
}

.lesson-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #111827;
}

.lesson-body {
  line-height: 1.75;
  color: #374151;
}

.lesson-body h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.lesson-body h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.lesson-body h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.lesson-body p {
  margin-bottom: 1rem;
}

.lesson-body code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.lesson-body pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.lesson-body pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.lesson-navigation {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-button {
  background-color: #e5e7eb;
  color: #374151;
}

.prev-button:not(:disabled):hover {
  background-color: #d1d5db;
}

.next-button {
  background-color: #3b82f6;
  color: white;
}

.next-button:not(:disabled):hover {
  background-color: #2563eb;
}
```

**Step 3: Commit**

```bash
git add frontend/src/components/LessonContent.tsx frontend/src/components/LessonContent.css
git commit -m "feat: add LessonContent component with markdown rendering"
```

---

## Task 5: Enhance Playground Component

**Files:**
- Modify: `frontend/src/components/Playground.tsx`

**Step 1: Add initialCode prop and useEffect**

Add to imports and props interface:

```tsx
import { useEffect, useState } from 'react';
import './Playground.css';

interface PlaygroundProps {
  initialCode?: string;
}

export function Playground({ initialCode }: PlaygroundProps) {
  const [selectedExample, setSelectedExample] = useState('hello');
  const [code, setCode] = useState(initialCode || examples.hello.code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  // Update code when initialCode prop changes
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      setSelectedExample(''); // Clear example selection
      setOutput('');
      setError('');
    }
  }, [initialCode]);
```

**Step 2: Commit**

```bash
git add frontend/src/components/Playground.tsx
git commit -m "feat: add initialCode prop to Playground component"
```

---

## Task 6: Update Course Page

**Files:**
- Modify: `frontend/src/pages/Course.tsx`

**Step 1: Rewrite Course.tsx**

Complete rewrite:

```tsx
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CourseDetail, Lesson } from '../types/course';
import { coursesApi } from '../api/courses';
import { LessonSidebar } from '../components/LessonSidebar';
import { LessonContent } from '../components/LessonContent';
import { Playground } from '../components/Playground';

export function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const lessonId = searchParams.get('lesson');

  // Fetch course details
  useEffect(() => {
    if (!courseId) return;

    coursesApi.getCourseDetail(courseId)
      .then(setCourse)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  // Fetch current lesson or redirect to first
  useEffect(() => {
    if (!course) return;

    if (!lessonId || !course.lessons.find(l => l.id === lessonId)) {
      // Redirect to first lesson
      const firstLesson = course.lessons[0];
      if (firstLesson) {
        navigate(`?lesson=${firstLesson.id}`, { replace: true });
        return;
      }
    }

    // Fetch lesson content
    const targetLessonId = lessonId || course.lessons[0]?.id;
    if (targetLessonId) {
      coursesApi.getLesson(courseId, targetLessonId)
        .then(setCurrentLesson)
        .catch(err => setError(err.message));
    }
  }, [course, lessonId, courseId, navigate]);

  const handleLessonClick = (newLessonId: string) => {
    navigate(`?lesson=${newLessonId}`);
  };

  const handleNextLesson = () => {
    if (!course || !currentLesson) return;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1];
      navigate(`?lesson=${nextLesson.id}`);
    }
  };

  const handlePrevLesson = () => {
    if (!course || !currentLesson) return;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      const prevLesson = course.lessons[currentIndex - 1];
      navigate(`?lesson=${prevLesson.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading course...</div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Course not found</div>
      </div>
    );
  }

  if (course.lessons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Courses
        </Link>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600">This course has no lessons yet.</p>
        </div>
      </div>
    );
  }

  const currentLessonIndex = currentLesson
    ? course.lessons.findIndex(l => l.id === currentLesson.id)
    : -1;

  return (
    <div className="course-page">
      <header className="course-header">
        <Link to="/" className="back-link">
          ← Back to Courses
        </Link>
        <h1 className="course-title">{course.title}</h1>
      </header>

      <div className="course-layout">
        <LessonSidebar
          lessons={course.lessons}
          currentLessonId={currentLesson?.id || ''}
          onLessonClick={handleLessonClick}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="course-main">
          {currentLesson ? (
            <LessonContent
              lesson={currentLesson}
              hasNext={currentLessonIndex < course.lessons.length - 1}
              hasPrev={currentLessonIndex > 0}
              onNext={handleNextLesson}
              onPrev={handlePrevLesson}
            />
          ) : (
            <div className="p-8">Loading lesson...</div>
          )}
        </main>

        <aside className="course-playground">
          <Playground initialCode={currentLesson?.code} />
        </aside>
      </div>
    </div>
  );
}
```

**Step 2: Create Course page styles**

Add to `frontend/src/pages/Course.css`:

```css
.course-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.course-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 64px;
}

.back-link {
  color: #3b82f6;
  text-decoration: none;
  white-space: nowrap;
}

.back-link:hover {
  text-decoration: underline;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.course-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.course-main {
  flex: 1;
  margin-left: 240px;
  margin-right: 400px;
  overflow-y: auto;
  background: white;
}

.course-playground {
  position: fixed;
  right: 0;
  top: 64px;
  bottom: 0;
  width: 400px;
  background: #f9fafb;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .course-main {
    margin-right: 0;
    padding-right: 1rem;
  }

  .course-playground {
    position: static;
    width: 100%;
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }

  .course-layout {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .course-main {
    margin-left: 0;
  }

  .sidebar-toggle.open {
    left: 0;
  }
}
```

Import the CSS in `Course.tsx`:

```tsx
import './Course.css';
```

**Step 3: Commit**

```bash
git add frontend/src/pages/Course.tsx frontend/src/pages/Course.css
git commit -m "feat: implement course learning page layout"
```

---

## Task 7: Update Route in App.tsx

**Files:**
- Modify: `frontend/src/App.tsx`

**Step 1: Update route parameter name**

Change from `:id` to `:courseId`:

```tsx
<Route path="/course/:courseId" element={<Course />} />
```

**Step 2: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "fix: update route param name to courseId"
```

---

## Task 8: Create Course CSS File (if not exists)

**Files:**
- Check: `frontend/src/pages/Course.css`

**Step 1: Verify Course.css exists**

Run: `ls -la frontend/src/pages/Course.css`

If exists, skip this task. If not, create it with content from Task 6, Step 2.

---

## Task 9: Verification Testing

**Step 1: Start development servers**

Run: `cd frontend && npm run dev:full`

Expected: Both frontend (port 5173) and backend (port 8081) running

**Step 2: Test page loads**

Open: `http://localhost:5173/course/go-basics?lesson=hello-world`

Expected:
- Three-column layout visible
- Lesson content displayed
- Playground loaded with lesson code
- Sidebar shows lesson list

**Step 3: Test navigation**

Click "Next Lesson" button

Expected:
- URL updates to new lesson ID
- Content and playground code update

**Step 4: Test sidebar toggle**

Click sidebar toggle button

Expected:
- Sidebar collapses/expands

**Step 5: Test invalid lesson**

Open: `http://localhost:5173/course/go-basics?lesson=invalid`

Expected:
- Redirects to first lesson

**Step 6: Test no lesson parameter**

Open: `http://localhost:5173/course/go-basics`

Expected:
- Redirects to first lesson with `?lesson=` appended

**Step 7: Final commit**

```bash
git add frontend/
git commit -m "feat: implement lesson page with playground integration"
```

---

## Summary

This plan creates:
1. LessonSidebar - collapsible lesson navigation
2. LessonContent - markdown rendered lesson content
3. Enhanced Playground - accepts initial code from lesson
4. Updated Course page - three-column layout with URL-driven state
5. Full navigation between lessons
6. Error handling and redirects

Total estimated time: 2-3 hours
