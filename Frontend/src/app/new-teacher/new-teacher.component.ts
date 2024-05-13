import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Teacher } from '../models/teacher.model';
import { Schedule } from '../models/schedule.model';
import { Major } from '../models/major.model';
import { Course } from '../models/course.model';
import { TeacherService } from '../services/teacher.service';
import { MajorService } from '../services/major.service';
import { CourseService } from '../services/course.service';

type WeekDay = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.component.html',
  styleUrl: './new-teacher.component.css'
})
export class NewTeacherComponent implements OnInit {
  teacher: Teacher = {
    id: 0,
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    majorId:0,
    courseId: 0,
    schedule: {},
    role: 'teacher'

  };

  allMajors: any[] = [];
  allCourses: any[] = []
  selectedMajorCode: number | null = null;

  availability: { [key in WeekDay]: string[] } = {
      lunes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      martes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      miercoles: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      jueves: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      viernes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
  }

  days = Object.keys(this.availability) as WeekDay[];

  constructor(private router: Router, private teacherService: TeacherService, private majorService: MajorService, private courseService: CourseService) {}

  ngOnInit(): void{
    // this.loadCourses();
    this.loadMajors();
    this.teacher.schedule = this.initSchedule();
  }
  // loadCourses() {
  //   this.courseService.getCourses().subscribe({
  //     next: (allCourses) => {
  //       this.allCourses = allCourses;
  //       console.log(this.allCourses)
  //     },
  //     error: (error) => {
  //       console.error('Error cargando materias ', error.message)
  //     }
  //   });
  // }
  loadMajors() {
    this.majorService.getMajors().subscribe({
      next: (allMajors) => {
        this.allMajors = allMajors
        console.log(this.allMajors)
      },
      error: (error) => console.error('Error cargando Carreras ', error)
    });
  }
  onMajorChange(): void {
    if (this.teacher.majorId) {
      this.courseService.getCoursesByMajor(this.teacher.majorId).subscribe({
        next: (allCourses) => {
          this.allCourses = allCourses;
          console.log(this.allCourses);
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

  initSchedule(): Schedule {
    let schedule: Schedule = {};
    if (this.days && this.days.length > 0) {
        this.days.forEach(day => {
            if (!schedule[day]) {
                schedule[day] = {};
            }
            if (this.availability[day]) {
                this.availability[day].forEach(time => {
                    schedule[day]![time] = false;  
                });
            }
        });
    }
    return schedule;
}
  getScheduleValue(day: WeekDay, time: string): boolean {
    if (!this.teacher.schedule[day]) {
      this.teacher.schedule[day] = {};
    }
    if (this.teacher.schedule[day]![time] === undefined) {
      this.teacher.schedule[day]![time] = false; 
    }
    return this.teacher.schedule[day]![time];
  }
  
  setScheduleValue(day: WeekDay, time: string, value: boolean): void {
    if (!this.teacher.schedule[day]) {
      this.teacher.schedule[day] = {};
    }
    this.teacher.schedule[day]![time] = value;
  }

  onSubmit(): void {
    this.teacherService.createTeacher(this.teacher).subscribe({
      next: (teacher) => {
        console.log('Si se armo ', teacher);
        this.router.navigate(['/admin-home']);
      },
      error: (error) => console.error('pos no se pudo ', error)
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
      schedule: this.initSchedule(),
      role: 'teacher'
    };
    this.router.navigate(['/admin-home'])
  }
}
