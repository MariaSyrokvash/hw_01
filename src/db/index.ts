import { Course } from '../types/courses';

export const db: { courses: Course[] } = {
  courses: [
    { id: 1, title: 'frontend', studentsCount: 10 },
    { id: 2, title: 'backend', studentsCount: 4 },
    { id: 3, title: 'q/a', studentsCount: 9 },
    { id: 4, title: 'devops', studentsCount: 2 },
  ],
};
