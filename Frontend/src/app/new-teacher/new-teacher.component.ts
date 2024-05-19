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
    majorId: 0,
    courseId: 0,
    courseIds: [] = [],
    role: 'teacher',
    profilePicture: '',
    password: '',
    
  };
  selectedCoursesByMajor: {[majorId: number]: number[]} = {}
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
    
    this.loadMajors();
    // this.teacher.schedule = this.initSchedule();
  }
  
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
      this.selectedCoursesByMajor[this.teacher.majorId] = [...this.teacher.courseIds]
    }

    const selectedCourses = this.selectedCoursesByMajor[this.teacher.majorId] || [];
    this.teacher.courseIds = selectedCourses;

    if (this.teacher.majorId) {
      this.courseService.getCoursesByMajor(this.teacher.majorId).subscribe({
        next: (allCourses) => {
          this.allCourses = allCourses;
          console.log(this.allCourses);
          this.teacher.courseIds = this.teacher.courseIds.filter(courseId => 
          this.allCourses.some(course => course.Id_Materias === courseId));
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

  onCourseSelectionChange(event: any): void {
    if (this.teacher.majorId) {
      this.selectedCoursesByMajor[this.teacher.majorId] = [...event.value]
    }
    this.teacher.courseIds = [...event.value]
    console.log('CourseIDS: ', this.teacher.courseIds)
    console.log('SelectedCourseByMajor: ', this.selectedCoursesByMajor)
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
  // getScheduleValue(day: WeekDay, time: string): boolean {
  //   if (!this.teacher.schedule[day]) {
  //     this.teacher.schedule[day] = {};
  //   }
  //   if (this.teacher.schedule[day]![time] === undefined) {
  //     this.teacher.schedule[day]![time] = false; 
  //   }
  //   return this.teacher.schedule[day]![time];
  // }
  
  // setScheduleValue(day: WeekDay, time: string, value: boolean): void {
  //   if (!this.teacher.schedule[day]) {
  //     this.teacher.schedule[day] = {};
  //   }
  //   this.teacher.schedule[day]![time] = value;
  // }

  onSubmit(): void {
    this.teacher.courseIds = [];
    for (const majorId in this.selectedCoursesByMajor) {
      if (this.selectedCoursesByMajor.hasOwnProperty(majorId)) {
        this.teacher.courseIds = this.teacher.courseIds.concat(this.selectedCoursesByMajor[majorId]);
      }
    }
    this.teacherService.createTeacher(this.teacher).subscribe({
      next: (response) => {
        console.log('Si se armo ', response);
        this.router.navigate(['/admin-home']);
      },
      error: (error) => console.error('Error al crear profesor ', error)
    });
    console.log(this.teacher.courseIds)
    console.log(this.selectedCoursesByMajor)
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
      courseIds: [],
      role: 'teacher',
      profilePicture: '',
      password: ''
    };
    this.router.navigate(['/admin-home'])
  }
}
