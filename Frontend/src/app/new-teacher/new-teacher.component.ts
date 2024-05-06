import { Component } from '@angular/core';
import { scheduled } from 'rxjs';
import { Router } from '@angular/router';
type WeekDay = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';
type Schedule = { [key in WeekDay]: { [key: string]: boolean } };


@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.component.html',
  styleUrl: './new-teacher.component.css'
})
export class NewTeacherComponent {
  teacher = {
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    majors: [],
    courses: [],
    schedule: {} as Schedule
  };

  allMajors = ['ICC']
  allCourses = ['Alhebra Superior', 'Calculo integral', 'Calculo diferencial', 'Ingenieria de Sfotware']

  availability: { [key in WeekDay]: string[] } = {
      lunes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      martes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      miercoles: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      jueves: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      viernes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
  }

  days = Object.keys(this.availability) as WeekDay[];

  constructor(private router: Router) {
    this.teacher.schedule = this.initSchedule();
  }

  initSchedule(): Schedule {
    const schedule: Schedule = {} as Schedule;
    this.days.forEach(day => {
      schedule[day] = {};
      this.availability[day].forEach(time => {
        schedule[day][time] = false;
      });
    });
    return schedule
  }

  onSubmit(): void {
    console.log('Form data: ', this.teacher)
    this.router.navigate(['/admin-home'])
  }

  onCancel(): void {
    console.log('Form cancelled')
    this.teacher = {
      name: '',
      lastName1: '',
      lastName2: '',
      email: '',
      majors: [],
      courses: [],
      schedule: {} as Schedule
    };
    this.router.navigate(['/admin-home'])
  }
}
