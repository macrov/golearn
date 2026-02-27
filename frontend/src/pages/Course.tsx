import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Course } from '../types/course';
import { coursesApi } from '../api/courses';
import { Playground } from '../components/Playground';

export function Course() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      coursesApi.getById(id)
        .then(setCourse)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!course) return <div className="text-center mt-10">Course not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to Courses
      </Link>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {course.level}
          </span>
          <span className="text-gray-600">
            {course.duration} hours
          </span>
          <span className="text-gray-600">
            by {course.instructor}
          </span>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">{course.description}</p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Practice Playground</h2>
          <Playground />
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-500">
            Created: {new Date(course.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
