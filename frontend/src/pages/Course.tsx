import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { CourseDetail, Lesson } from '../types/course';
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
  const [completedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [userOutput, setUserOutput] = useState<string>('');  // 用户运行代码的输出

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
        setUserOutput('');  // 切换课时清空输出
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
        <div className="text-gray-600">加载课程中...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">错误: {error}</div>
          <Link to="/" className="text-blue-500 hover:underline">
            返回课程列表
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
          <div className="text-gray-600 text-lg mb-4">课程未找到</div>
          <Link to="/" className="text-blue-500 hover:underline">
            返回课程列表
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
          ← 返回课程列表
        </Link>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">这个课程还没有课时。</p>
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
            ← 返回课程列表
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {lessonLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-600">加载课时中...</div>
            </div>
          ) : currentLesson ? (
            <LessonContent
              lesson={currentLesson}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              onPrevious={handlePrevious}
              onNext={handleNext}
              userOutput={userOutput}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-red-500">无法加载课时内容</div>
            </div>
          )}

          {sidebarOpen && (
            <aside className="w-96 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">代码练习</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <Playground 
                  initialCode={currentLesson?.code}
                  onOutput={setUserOutput}
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
