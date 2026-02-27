export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  content: string;
  code: string;
  test_cases: TestCase[];
}

export interface TestCase {
  input: string;
  expected_output: string;
}
