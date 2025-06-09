import { Course } from '../types/courses';
import { ViewCourseModel } from '../models/courses/ViewCourseModel';

export const getViewCourseModel = (dbCourse: Course): ViewCourseModel =>  {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  }
}
