import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';
import { Major } from '../models/major.model';
import { Course } from '../models/course.model';
import { Advisory } from '../models/advisory.model';

@Injectable({
  providedIn: 'root'
})
export class AdvisoryService {
  private apiUrl = ''

  constructor(private http: HttpClient) { }

  getMajors(): Observable<Major[]> {
    return this.http.get<Major[]>('${this.apiUrl}/courses')
  }
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('${this.apiUrl}/subjects')
  }
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>('${this.apiUrl}/subjects')
  }
  getModes(): Observable<any[]> {
    return this.http.get<any[]>('${this.apiUrl}/teachers')
  }
  getTimes(teacherId: number): Observable<any[]> {
    return this.http.get<any[]>('${this.apiUrl}/times/byTeacher/${teacherId}')
  }
  getTimesByTeacherId(teacherId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/times/byTeacher/${teacherId}`);
  }

  createAdvisory(advisoryData: Advisory, role: 'student' | 'teacher' | 'admin'): Observable<any> {
    const apiUrl = 'api/advisories';
    return this.http.post(apiUrl, { ...advisoryData, role})
  }
}
