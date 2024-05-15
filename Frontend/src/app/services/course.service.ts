import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createCourse(course: Course): Observable<Course> {
    const payload = {
      Id_Materias: course.id,
      N_Carr: course.majorId,
      N_Sem: course.NumberOfSemester,
      N_Mat: course.name
    };
    return this.http.post<Course>(`${this.apiUrl}/materias`, payload);
  }

  editCourse(id: number, course: Course):Observable<Course> {
    const payload = {
      Id_Materias: course.id,
      N_Carr: course.majorId,
      N_Sem: course.NumberOfSemester,
      N_Mat: course.name
    };
    return this.http.put<Course>(`${this.apiUrl}/materias/${id}`, payload)
  }
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/materias`)
  }

  getCoursesByMajor(majorId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/materias/${majorId}`);
  }

  
}