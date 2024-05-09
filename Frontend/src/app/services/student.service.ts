import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { UtilitiesService } from './utilities.service';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiURL = '';

  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }

  createStudent(student: Student): Observable<Student> {
    const password = this.utilitiesService.createPassword();
    const studentWithPassword = {...student, password}
    return this.http.post<Student>(this.apiURL, studentWithPassword);
  }
  getStudent(): Observable<Student[]>{
    return this.http.get<Student[]>(this.apiURL);
  }
  getStudentDataById(studentId: number): Observable<Student> {
    return this.http.get<Student>('${this.apiUrl}/${studentId}')
  }

}
