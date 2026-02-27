# Course Learning Page Design

**Date:** 2025-02-27
**Status:** Approved
**Author:** Claude

## Overview

Design a course learning page that displays lesson content alongside an interactive Go code playground. The page enables users to learn Go programming concepts through a structured curriculum with hands-on practice.

## Layout Structure

Three-column responsive layout:

```
┌─────────────────────────────────────────────────────────────────┐
│  [← Back to Courses]           Course Title        [Toggle ☰]    │
├──────────┬────────────────────────────────────┬─────────────────┤
│          │                                    │                 │
│  Lesson  │        Lesson Content              │    Playground   │
│  Sidebar │        (Markdown)                  │                 │
│          │                                    │                 │
│  Lesson  │    ┌──────────────────────┐        │    ┌─────────┐  │
│    1 ✓   │    │  Lesson Title        │        │    │  code   │  │
│  Lesson  │    │                      │        │    │         │  │
│    2 ... │    │  Content body...     │        │    │         │  │
│  Lesson  │    │                      │        │    │         │  │
│    3     │    │  [code blocks]       │        │    └─────────┘  │
│          │    └──────────────────────┘        │    [▶ Run]      │
│          │                                    │    Output:      │
│          │    [← Prev]  [Next →]             │    hello        │
│          │                                    │                 │
└──────────┴────────────────────────────────────┴─────────────────┘
```

**Column dimensions:**
- Left Sidebar: 240px (collapsible)
- Main Content: flex-1
- Right Panel: 400px

**Mobile (< 768px):** Stacks vertically with sidebar as drawer

## Component Architecture

```
Course.tsx (page component)
├── LessonSidebar.tsx (left sidebar)
│   └── LessonItem.tsx (individual lesson with progress)
├── LessonContent.tsx (main content area)
│   └── ReactMarkdown (from react-markdown)
└── Playground.tsx (existing, enhanced)
    └── New prop: initialCode from lesson
```

### New Components

1. **LessonSidebar.tsx**
   - Collapsible sidebar showing all lessons
   - Progress indicators (✓ completed, ○ in-progress, — not-started)
   - Click navigation to switch lessons
   - Toggle button for collapse/expand

2. **LessonContent.tsx**
   - Lesson title
   - Markdown-rendered content using `react-markdown`
   - Previous/Next navigation buttons

3. **LessonItem.tsx**
   - Individual lesson list item
   - Displays title, order number, progress marker
   - Active state highlighting

### Enhanced Components

- **Playground.tsx** - Add `initialCode?: string` prop to accept lesson code

## Data Flow & State Management

### URL-Driven State

- `courseId` from URL params: `/course/:courseId`
- `lessonId` from query param: `?lesson=hello-world`

### Component State

```typescript
// Course.tsx
const { courseId } = useParams()
const [searchParams] = useSearchParams()
const lessonId = searchParams.get('lesson')

const [course, setCourse] = useState<CourseDetail | null>(null)
const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
const [sidebarOpen, setSidebarOpen] = useState(true)
const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
```

### Data Fetching Flow

1. On mount: Fetch course details via `/api/courses/:courseId`
2. If `lessonId` exists: Fetch lesson via `/api/courses/:courseId/lessons/:lessonId`
3. If no `lessonId`: Redirect to first lesson
4. Update URL when navigating: `navigate(\`?lesson=${nextId}\`)`

### Progress Tracking (In-Memory Only)

- Current lesson: matched by `currentLesson?.id`
- Completed lessons: stored in `completedLessons` Set
- Not started: all other lessons in course

## API Design

### New API Endpoints

```typescript
// In frontend/src/api/courses.ts
export const coursesApi = {
  // Existing methods...

  // NEW: Get course detail with lessons
  getCourseDetail: async (id: string): Promise<CourseDetail> => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  // NEW: Get single lesson content
  getLesson: async (courseId: string, lessonId: string): Promise<Lesson> => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`);
    if (!response.ok) throw new Error('Failed to fetch lesson');
    return response.json();
  }
}
```

### Backend Requirements

- `GET /api/courses/:courseId` - Returns `CourseDetail` with lessons array
- `GET /api/courses/:courseId/lessons/:lessonId` - Returns single `Lesson` with content and code

### Response Format (CourseDetail)

```json
{
  "id": "go-basics",
  "title": "Go Basics",
  "description": "...",
  "instructor": "...",
  "duration": 10,
  "level": "beginner",
  "category": "go",
  "lessons_count": 5,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z",
  "lessons": [
    {
      "id": "hello-world",
      "title": "Hello World",
      "description": "Your first Go program",
      "order": 1,
      "content": "# Hello World\n\nYour first Go program...",
      "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}",
      "test_cases": []
    }
  ]
}
```

## Error Handling & Edge Cases

### Error States

1. **Invalid course ID (404)**
   - Show: "Course not found" with link to course list
   - No redirect, let user navigate back

2. **Invalid or missing lesson ID**
   - If `lesson` query param is missing or invalid
   - Action: Redirect to first lesson of course
   - Implementation: `navigate(\`?lesson=${course.lessons[0].id}\`, { replace: true })`

3. **Lesson load failure**
   - Show error message in main content area
   - Keep sidebar visible so user can try another lesson

4. **Empty course (no lessons)**
   - Show message: "This course has no lessons yet"
   - Hide sidebar and navigation

5. **Playground load failure**
   - Show error in playground panel
   - Don't block lesson content display

### Loading States

- Initial course load: Full-page skeleton/spinner
- Lesson navigation: Small spinner in content area only
- Sidebar toggle: Instant, no loading state

## Dependencies & Styling

### New Dependencies

```bash
npm install react-markdown
```

### Styling Approach

- Use existing Tailwind CSS utility classes
- Extend existing `Playground.css` patterns
- Responsive breakpoints: Stack columns on mobile

### New CSS Classes

- `.lesson-sidebar` - Fixed width, scrollable lesson list
- `.lesson-item` - Individual lesson with hover states
- `.progress-marker` - Visual indicators (✓ ○ —)
- `.lesson-content` - Markdown typography

### Color Scheme (Progress)

- Completed: `text-green-600` (✓)
- In-progress: `text-blue-600` (●)
- Not started: `text-gray-400` (—)

### Navigation Buttons

- Previous: `bg-gray-200 hover:bg-gray-300`
- Next: `bg-blue-500 hover:bg-blue-600 text-white`
- Disabled state for First/Last lesson boundaries

## Route Updates

**Current:** `/course/:id`
**New:** `/course/:courseId`

Update in `App.tsx`:
```tsx
<Route path="/course/:courseId" element={<Course />} />
```

## Acceptance Criteria

Visiting `/course/go-basics?lesson=hello-world` displays:
1. ✅ Complete three-column layout (sidebar, content, playground)
2. ✅ Lesson title and markdown-rendered content
3. ✅ Playground pre-loaded with lesson code
4. ✅ Functional Previous/Next navigation buttons
5. ✅ Collapsible lesson sidebar with progress indicators
6. ✅ URL updates on lesson navigation
7. ✅ Redirect to first lesson if no lesson parameter provided
