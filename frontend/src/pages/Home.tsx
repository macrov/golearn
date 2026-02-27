import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types/course';
import { coursesApi } from '../api/courses';

const getLevelBadge = (level: Course['level']) => {
  const badges = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };
  return badges[level];
};

export function Home() {
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Failed to load courses</div>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">GoLearn Courses</h1>

        {courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No courses available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link key={course.id} to={`/course/${course.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 p-6 h-full flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{course.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded capitalize ${getLevelBadge(course.level)}`}>
                        {course.level}
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.lessons_count} {course.lessons_count === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400">
                      {course.instructor} · {course.duration}h
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
