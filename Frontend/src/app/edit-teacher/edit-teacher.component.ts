import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Teacher } from '../models/teacher.model';
import { Schedule } from '../models/schedule.model';
import { Major } from '../models/major.model';
import { Course } from '../models/course.model';
import { TeacherService } from '../services/teacher.service';
import { MajorService } from '../services/major.service';
import { CourseService } from '../services/course.service';


@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrl: './edit-teacher.component.css'
})
  
export class EditTeacherComponent {
  teacher: Teacher = {
    id: 0,
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    majorId:0,
    courseId: 0,
    role: 'teacher',
    profilePicture: '',
    password: '',
  };

  allMajors: any[] = [];
  allCourses: any[] = [];
  allTeachers: any[] = [];

  constructor(private router: Router, private teacherService: TeacherService, private majorService: MajorService, private courseService: CourseService) {}

  ngOnInit(): void{
    this.loadMajors();
    this.loadTeachers();
  }
  
  loadMajors(): void {
    this.majorService.getMajors().subscribe({
      next: (allMajors) => {
        this.allMajors = allMajors;
        console.log('Carreras: ', this.allMajors);
      },
      error: (error) => console.error('Error cargando Carreras ', error)
    });
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (allTeachers) => {
        this.allTeachers = allTeachers;
        console.log('Docentes: ', this.allTeachers);
      },
      error: (error => console.error('Error cargando docentes: ', error))
    })
  }

  loadCoursesOnMajorChange(): void {
    if (this.teacher.majorId) {
      this.courseService.getCoursesByMajor(this.teacher.majorId).subscribe({
        next: (allCourses) => {
          this.allCourses = allCourses;
          console.log('Carrera elegida: ', this.teacher.majorId, 'Materias correspondientes: ', this.allCourses);
        }, 
        error: (error) => {
          console.error('Error al cargar materias: ', error);
          this.allCourses = []
        }
      });
    } else {
      this.allCourses = [];
    }
  }

  onSubmit(): void {
    console.log(this.teacher);
    this.teacherService.editTeacher(this.teacher.id, this.teacher).subscribe({
      next: (response) => {
        console.log('Docente editado correctamemnte: ', response);
        this.router.navigate(['/admin-home']);
      },
      error: (error) => console.error('Error al editar profesor ', error)
    });
  }

  onCancel(): void {
    console.log('Form cancelled')
    this.teacher = {
      id: 0,
      name: '',
      lastName1: '',
      lastName2: '',
      email: '',
      majorId: 0,
      courseId: 0,
      role: 'teacher',
      profilePicture: '',
      password: '',
    };
    this.router.navigate(['/admin-home'])
  }
  
  onDelete(): void{
    this.teacherService.deleteTeacher(this.teacher.id).subscribe({
      next: (response) => {
        console.log('Docente eliminado correctamente ', response);
        this.router.navigate(['/admin-home'])
      },
      error: (error) => {
        console.error('Error al eliminar docente ', error.message)
      }
    });
  }
}
