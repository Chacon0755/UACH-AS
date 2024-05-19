import { Component, OnInit } from '@angular/core';
import { AdvisoryService } from '../services/advisory.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Major } from '../models/major.model';
import { Course } from '../models/course.model';
import { Teacher } from '../models/teacher.model';
import { Student } from '../models/student.model';
import { MajorService } from '../services/major.service';
import { TeacherService } from '../services/teacher.service';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { StudentService } from '../services/student.service';
import { tap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Advisory } from '../models/advisory.model';



@Component({
  selector: 'app-advisory-request-student',
  templateUrl: './advisory-request-student.component.html',
  styleUrl: './advisory-request-student.component.css'
})
export class AdvisoryRequestStudentComponent implements OnInit {
  advisory: Advisory = {
    majorId: 0,
    courseId: 0,
    teacherId:  0,
    mode: '',
    days: [],
    time: ''
  }
  majors: Major[] = [];
  allCourses: any[] = [];
  teachers: any[] = [];
  modes = [{id: 'Presencial', name: 'Presencial'}, {id: 'Virtual', name: 'Virtual'}]
  times = [];
  

  majorId: number= 0;
  majorName: string= '';

  constructor(private advisoryService: AdvisoryService, private fb: FormBuilder, private router: Router, private majorService: MajorService, private teacherService: TeacherService, private courseService: CourseService, private authService: AuthService, private studentService: StudentService) {
    
  }
  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.loadStudentMajorName(userDetails.id)

    }
    
  }
  
  loadStudentMajorName(studentId: number): void {
    this.studentService.getStudentMajorNameById(studentId).subscribe({
      next: (student) => {
        this.majorId = student.id_carrera;
        this.majorName = student.nombre_carrera;
        console.log('major: ',this.majorId, this.majorName)
        this.loadCoursesByStudentMajorId();
        console.log('Estudiante: ',student)
      },
      error: (error) => {
        console.error('Error al cargar datos del estudiante: ', error);
      }
    });
  }
  loadCoursesByStudentMajorId(): void {
    this.courseService.getCoursesByMajor(this.majorId).subscribe({
      next: (allCourses) => {
        this.allCourses = allCourses;
        console.log('materias: ' ,this.allCourses);
      }, 
      error: (error) => {
        console.error('Error al cargar materias: ', error);
        this.allCourses = []
      }
    });
  }

  loadTeachersByCourseId(courseId: number): void {
    this.teacherService.getTeachersByCourseId(courseId).subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        console.log('Teachers:', this.teachers)
      },
      error: (error) => {
        console.error('Error al cargar docentes: ', error);
      }
    });
  }
  onCourseChange(courseId: number): void {
    this.loadTeachersByCourseId(courseId);
    console.log('id: ',courseId)
  }
  
  loadTimes(teacherId: number) {
    this.advisoryService.getTimesByTeacherId(teacherId).subscribe(data => this.times = data)
  }

  submitForm() {
    if (this.advisory) {
      this.advisoryService.createAdvisory(this.advisory, 'student').subscribe({
        next: response => {
          console.log('Asesoria creada con exito', response);
          this.router.navigate(['/student-home'])
        },
        error: err => {
          console.error('Error solicitando asesoria', err)
        }
      });
    }
  }

  onCancel(){
    this.router.navigate(['/student-home'])
  }
}
