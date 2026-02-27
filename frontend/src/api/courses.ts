import { Course } from '../types/course';

const API_BASE_URL = 'http://localhost:8081/api';

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
};
