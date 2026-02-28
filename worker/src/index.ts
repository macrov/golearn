export interface Env {
  DB: D1Database;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: string;
  category: string;
  lessons_count: number;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content: string;
  code: string;
  hints: string | null;
  expected_output: string | null;
  order: number;
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  console.log('Received request:', request.method, request.url);
  
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET /api/courses
    if (path === '/api/courses' && request.method === 'GET') {
      console.log('Fetching courses from D1...');
      const result = await env.DB.prepare('SELECT * FROM courses').all<Course>();
      console.log('Courses fetched:', result.results.length);
      return Response.json(result.results, { headers: corsHeaders });
    }

    // GET /api/courses/:id
    const courseMatch = path.match(/^\/api\/courses\/([^\/]+)$/);
    if (courseMatch && request.method === 'GET') {
      const courseId = courseMatch[1];
      console.log('Fetching course:', courseId);
      const course = await env.DB.prepare('SELECT * FROM courses WHERE id = ?')
        .bind(courseId)
        .first<Course>();
      
      if (!course) {
        return Response.json({ error: 'Course not found' }, { status: 404, headers: corsHeaders });
      }

      const lessons = await env.DB.prepare('SELECT id, title, description, "order" FROM lessons WHERE course_id = ? ORDER BY "order"')
        .bind(courseId)
        .all<Lesson>();

      return Response.json({ ...course, lessons: lessons.results }, { headers: corsHeaders });
    }

    // GET /api/courses/:id/lessons/:lessonId
    const lessonMatch = path.match(/^\/api\/courses\/([^\/]+)\/lessons\/([^\/]+)$/);
    if (lessonMatch && request.method === 'GET') {
      const [, courseId, lessonId] = lessonMatch;
      console.log('Fetching lesson:', courseId, lessonId);
      const lesson = await env.DB.prepare('SELECT * FROM lessons WHERE course_id = ? AND id = ?')
        .bind(courseId, lessonId)
        .first<Lesson>();

      if (!lesson) {
        return Response.json({ error: 'Lesson not found' }, { status: 404, headers: corsHeaders });
      }

      return Response.json(lesson, { headers: corsHeaders });
    }

    // Health check
    if (path === '/health') {
      return Response.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders });
    }

    // 404 for unknown routes
    return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Internal server error', details: String(error) }, { status: 500, headers: corsHeaders });
  }
}

export default {
  fetch: handleRequest,
};
