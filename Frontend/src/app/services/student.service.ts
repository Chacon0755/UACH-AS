import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiURL = '';

  constructor(private http: HttpClient) { }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiURL, student);
  }
  getStudent(): Observable<Student[]>{
    return this.http.get<Student[]>(this.apiURL);
  }
  getStudentDataById(studentId: number): Observable<Student> {
    return this.http.get<Student>('${this.apiUrl}/${studentId}')
  }

}
