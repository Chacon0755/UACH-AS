import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = '';
  constructor(private http: HttpClient) { }
  
  createTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacher);
  }
  getTeachers(): Observable<Teacher[]>{
    return this.http.get<Teacher[]>(this.apiUrl);
  }
}
