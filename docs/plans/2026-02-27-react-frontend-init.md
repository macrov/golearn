# React Frontend Initialization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Initialize a React + TypeScript frontend for golearn using Vite, with routing, Tailwind CSS styling, and basic course management pages.

**Architecture:** Single Page Application (SPA) using Vite as build tool, React Router for navigation, Tailwind CSS for utility-first styling, and modular API layer for backend communication.

**Tech Stack:** React 18, TypeScript, Vite 5, React Router 6, Tailwind CSS 3

---

## Task 1: Create Vite + React + TypeScript Project

**Files:**
- Create: `frontend/` (entire project structure via Vite)

**Step 1: Create project using Vite**

Run in `/Users/macrov/projects/golearn`:
```bash
npm create vite@latest frontend -- --template react-ts
```

Expected: Project created with `frontend/` containing package.json, tsconfig.json, vite.config.ts, etc.

**Step 2: Install base dependencies**

Run in `frontend/`:
```bash
cd frontend && npm install
```

Expected: Dependencies installed successfully, no errors.

**Step 3: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Server running on http://localhost:5173, shows Vite + React template

**Step 4: Stop server and commit**

```bash
git add frontend/
git commit -m "feat(frontend): create Vite React TypeScript project"
```

---

## Task 2: Install Additional Dependencies

**Files:**
- Modify: `frontend/package.json`

**Step 1: Install routing**

Run in `frontend/`:
```bash
npm install react-router-dom
```

Expected: Package added to dependencies

**Step 2: Install Tailwind CSS and dependencies**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
```

Expected: Tailwind packages added to devDependencies

**Step 3: Install Node types**

Run:
```bash
npm install -D @types/node
```

Expected: @types/node added to devDependencies

**Step 4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "feat(frontend): add router, tailwind, and node types"
```

---

## Task 3: Configure Tailwind CSS

**Files:**
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Modify: `frontend/src/index.css`

**Step 1: Initialize Tailwind config**

Run in `frontend/`:
```bash
npx tailwindcss init -p
```

Expected: Creates `tailwind.config.js` and `postcss.config.js`

**Step 2: Configure Tailwind content paths**

Edit `frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 3: Replace index.css with Tailwind directives**

Edit `frontend/src/index.css` (replace all content):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 4: Commit**

```bash
git add frontend/tailwind.config.js frontend/postcss.config.js frontend/src/index.css
git commit -m "feat(frontend): configure Tailwind CSS"
```

---

## Task 4: Create Directory Structure

**Files:**
- Create: `frontend/src/components/`
- Create: `frontend/src/pages/`
- Create: `frontend/src/api/`
- Create: `frontend/src/types/`

**Step 1: Create directories**

Run:
```bash
mkdir -p frontend/src/{components,pages,api,types}
```

Expected: Directories created successfully

**Step 2: Create index files for clean imports**

Create `frontend/src/types/index.ts`:
```typescript
// Types will be exported from here
export {};
```

**Step 3: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): create directory structure"
```

---

## Task 5: Define Course Types

**Files:**
- Create: `frontend/src/types/course.ts`

**Step 1: Create course type definition**

Create `frontend/src/types/course.ts`:
```typescript
export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: number; // in hours
  level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: number;
}
```

**Step 2: Export from types index**

Edit `frontend/src/types/index.ts`:
```typescript
export * from './course';
```

**Step 3: Commit**

```bash
git add frontend/src/types/
git commit -m "feat(frontend): define course types"
```

---

## Task 6: Create API Layer

**Files:**
- Create: `frontend/src/api/courses.ts`

**Step 1: Create courses API module**

Create `frontend/src/api/courses.ts`:
```typescript
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const coursesApi = {
  async getAll(): Promise<Course[]> {
    const response = await fetch(`${API_BASE}/api/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async getById(id: number): Promise<Course> {
    const response = await fetch(`${API_BASE}/api/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  async create(data: CreateCourseRequest): Promise<Course> {
    const response = await fetch(`${API_BASE}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  async update(data: UpdateCourseRequest): Promise<Course> {
    const response = await fetch(`${API_BASE}/api/courses/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete course');
  },
};
```

**Step 2: Commit**

```bash
git add frontend/src/api/
git commit -m "feat(frontend): create courses API layer"
```

---

## Task 7: Create Home Page

**Files:**
- Create: `frontend/src/pages/Home.tsx`

**Step 1: Create Home component**

Create `frontend/src/pages/Home.tsx`:
```typescript
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">GoLearn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
              >
                Home
              </Link>
              <Link
                to="/courses"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Courses
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to GoLearn
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Master new skills with our expert-led courses
          </p>
          <Link
            to="/courses"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Browse Courses
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">Learn from industry professionals with years of experience.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
            <p className="text-gray-600">Study at your own pace, anytime, anywhere.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Practical Skills</h3>
            <p className="text-gray-600">Gain hands-on experience with real-world projects.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/pages/Home.tsx
git commit -m "feat(frontend): create Home page"
```

---

## Task 8: Create Courses List Page

**Files:**
- Create: `frontend/src/pages/Courses.tsx`

**Step 1: Create Courses component**

Create `frontend/src/pages/Courses.tsx`:
```typescript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../api/courses';
import { Course } from '../types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    coursesApi.getAll()
      .then(setCourses)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                GoLearn
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/courses" className="text-indigo-600 font-semibold px-3 py-2 rounded-md">
                Courses
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">All Courses</h2>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-3 ${
                  course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.instructor}</span>
                  <span>{course.duration}h</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/pages/Courses.tsx
git commit -m "feat(frontend): create Courses list page"
```

---

## Task 9: Create Course Detail Page

**Files:**
- Create: `frontend/src/pages/CourseDetail.tsx`

**Step 1: Create CourseDetail component**

Create `frontend/src/pages/CourseDetail.tsx`:
```typescript
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { coursesApi } from '../api/courses';
import { Course } from '../types';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    coursesApi.getById(Number(id))
      .then(setCourse)
      .catch(err => {
        setError(err.message);
        setTimeout(() => navigate('/courses'), 2000);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error || 'Course not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                GoLearn
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/courses" className="text-indigo-600 font-semibold px-3 py-2 rounded-md">
                Courses
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/courses"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          ← Back to Courses
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${
            course.level === 'beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>

          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {course.instructor}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration} hours
            </span>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-3">About this course</h2>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>

          <button className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Enroll Now
          </button>
        </div>
      </main>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/pages/CourseDetail.tsx
git commit -m "feat(frontend): create Course detail page"
```

---

## Task 10: Configure App Routing

**Files:**
- Modify: `frontend/src/App.tsx`

**Step 1: Replace App.tsx with routing**

Edit `frontend/src/App.tsx` (replace all content):
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**Step 2: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat(frontend): configure app routing"
```

---

## Task 11: Clean Up and Environment Config

**Files:**
- Delete: `frontend/src/assets/`
- Modify: `frontend/src/App.css` (keep empty for Tailwind)
- Create: `frontend/.env`

**Step 1: Remove unused assets**

Run:
```bash
rm -rf frontend/src/assets/react.svg
```

**Step 2: Clear App.css (Tailwind handles styles)**

Edit `frontend/src/App.css` (replace all content):
```css
/* Styles handled by Tailwind CSS */
```

**Step 3: Create environment file**

Create `frontend/.env`:
```
VITE_API_BASE=http://localhost:8080
```

**Step 4: Commit**

```bash
git add frontend/src/App.css frontend/.env frontend/src/assets/
git commit -m "feat(frontend): clean up unused assets, add env config"
```

---

## Task 12: Final Verification

**Files:**
- Test all components

**Step 1: Install all dependencies**

Run:
```bash
cd frontend && npm install
```

Expected: All dependencies installed successfully

**Step 2: Start dev server**

Run:
```bash
npm run dev
```

Expected: Server running on http://localhost:5173

**Step 3: Verify pages work**

Test in browser:
- Visit http://localhost:5173 - Should show Home page
- Click "Courses" button - Should navigate to /courses
- Visit http://localhost:5173/courses - Should show courses list
- Visit http://localhost:5173/courses/1 - Should show course detail (with API error if backend not running)

**Step 4: Final commit**

```bash
git add frontend/
git commit -m "feat(frontend): initialize React app with Vite and Tailwind"
```

---

## Acceptance Criteria

- [x] npm install succeeds without errors
- [x] npm run dev starts server on localhost:5173
- [x] Home page displays at localhost:5173
- [x] Navigation between pages works
- [x] Tailwind styles are applied
- [x] TypeScript compiles without errors

## Notes

- Backend API must be running on port 8080 for courses page to load data
- If backend is unavailable, error handling will display appropriate messages
- All components use functional components with hooks
- TypeScript strict mode is enabled
