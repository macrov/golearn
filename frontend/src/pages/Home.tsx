import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types/course';
import { coursesApi } from '../api/courses';

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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">GoLearn Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link key={course.id} to={`/course/${course.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{course.instructor}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {course.level}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                {course.duration} hours
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
