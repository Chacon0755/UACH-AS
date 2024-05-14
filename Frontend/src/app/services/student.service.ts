import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { UtilitiesService } from './utilities.service';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }

  createStudent(student: Student): Observable<Student> {
    // const password = this.utilitiesService.createPassword();
    // const studentWithPassword = { ...student, password }
    const payload = {
      matricula: student.schoolId,
      nombre: student.name,
      ape1: student.lastName1,
      ape2: student.lastName2,
      programa: student.majorId,
      semestre: student.numberOfSemester,
      correo: student.email,
      perfil: '',
      rol: 'student'
    }
    return this.http.post<Student>(`${this.apiURL}/alumnos`, payload);
  }

  editStudent(id: number, student: Student): Observable<Student> {
    const payload = {
      matricula: student.schoolId,
      nombre: student.name,
      ape1: student.lastName1,
      ape2: student.lastName2,
      programa: student.majorId,
      semestre: student.numberOfSemester,
      correo: student.email,
      perfil: 'n',
      rol: 'student'
    }
    return this.http.put<Student>(`${this.apiURL}/alumnos/${id}`, payload)
  }
  getStudents(): Observable<Student[]>{
    return this.http.get<Student[]>(`${this.apiURL}/alumnos`);
  }
  getStudentDataById(studentId: number): Observable<Student> {
    return this.http.get<Student>('${this.apiUrl}/${studentId}')
  }

}
