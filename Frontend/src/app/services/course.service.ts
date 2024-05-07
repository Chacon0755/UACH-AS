import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = '';

  constructor(private http: HttpClient) { }

  createCourse(course: Course): Observable<Course>{
    return this.http.post<Course>(this.apiUrl, course);
  }
  getCourses(): Observable<Course[]>{
    return this.http.get<Course[]>(this.apiUrl)
  }
  getCoursesByMajor(majorCode: number): Observable<Course[]>{
    return this.http.get<Course[]>('${this.apiUrl}/courses/byMajor/${majorCode}')
  }
}
