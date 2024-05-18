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

  //J4y8jeHx
  
  createTeacher(teacher: Teacher): Observable<Teacher> {
    const password = this.utilitiesService.createPassword();
    const payload = {
      Id_docente: teacher.id,
      nombre_doc: teacher.name,
      Apellido: teacher.lastName1,
      id_mat_as: teacher.courseId,
      id_carrera_mat: teacher.majorId,
      correo: teacher.email,
      apei2: teacher.lastName2,
      perfil: 'n',
      rol_doc: 'teacher',
      contra_docente: password
    }
    console.log(password)
    return this.http.post<Teacher>(`${this.apiUrl}/docentes`, payload);
  }

  editTeacher(id: number, teacher: Teacher): Observable<Teacher>{
    const payload = {
      Id_docente: teacher.id,
      nombre_doc: teacher.name,
      Apellido: teacher.lastName1,
      id_mat_as: teacher.courseId,
      id_carrera_mat: teacher.majorId,
      correo: teacher.email,
      apei2: teacher.lastName2,
      perfil: 'n',
      rol_doc: 'teacher'
    };
    return this.http.put<Teacher>(`${this.apiUrl}/docentes/${id}`, payload);
  }
  getTeachers(): Observable<Teacher[]>{
    return this.http.get<Teacher[]>(`${this.apiUrl}/docentes`);
  }
  getCourses(teacherId: number): Observable<Course[]>{
    return this.http.get<Course[]>('${this.apiUrl}/${teacherId}/courses')
  }
  getTeacherDataById(teacherId: number): Observable<Teacher>{
    return this.http.get<Teacher>('${this.apiUrl}/${teacherId}')
  }

  deleteTeacher(teacherId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/docentes/${teacherId}`)
  }
}
