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

// 调用 Go Playground API 编译执行代码
async function compileAndRun(code: string): Promise<{ output: string; error: string | null }> {
  try {
    // Go Playground API
    const response = await fetch('https://play.golang.org/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `body=${encodeURIComponent(code)}&version=2`,
    });

    if (!response.ok) {
      return { output: '', error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const result = await response.json();
    
    // 解析结果
    if (result.Errors) {
      return { output: '', error: result.Errors };
    }

    // 提取输出
    let output = '';
    if (result.Events) {
      for (const event of result.Events) {
        if (event.Message) {
          output += event.Message;
        }
      }
    }

    return { output, error: null };
  } catch (err) {
    return { output: '', error: String(err) };
  }
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
    // POST /api/compile - 编译执行代码
    if (path === '/api/compile' && request.method === 'POST') {
      const body = await request.json<{ code: string }>();
      const { code } = body;
      
      if (!code) {
        return Response.json({ error: 'Code is required' }, { status: 400, headers: corsHeaders });
      }

      console.log('Compiling code...');
      const result = await compileAndRun(code);
      console.log('Compile result:', result);

      return Response.json(result, { headers: corsHeaders });
    }

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
