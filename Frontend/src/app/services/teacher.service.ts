import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';
import { Course } from '../models/course.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }
  
  createTeacher(teacher: Teacher): Observable<Teacher> {
    const password = this.utilitiesService.createPassword();
    const teacherWithPassword = {...teacher, password}
    return this.http.post<Teacher>(this.apiUrl, teacherWithPassword);
  }
  getTeachers(): Observable<Teacher[]>{
    return this.http.get<Teacher[]>(this.apiUrl);
  }
  getCourses(teacherId: number): Observable<Course[]>{
    return this.http.get<Course[]>('${this.apiUrl}/${teacherId}/courses')
  }
  getTeacherDataById(teacherId: number): Observable<Teacher>{
    return this.http.get<Teacher>('${this.apiUrl}/${teacherId}')
  }
}
