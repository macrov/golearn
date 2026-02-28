import type { Course, CourseDetail, Lesson } from '../types/course';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return response.json();
  },

  getById: async (id: string): Promise<Course> => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }
    return response.json();
  },

  getCourseDetail: async (id: string): Promise<CourseDetail> => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course details');
    }
    return response.json();
  },

  getLesson: async (courseId: string, lessonId: string): Promise<Lesson> => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch lesson');
    }
    return response.json();
  },
};
