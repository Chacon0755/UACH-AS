import { Component } from '@angular/core';

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
    major: '',
    courses: '',
    advisorys: [] as any[]
  };

  availability = {
    lunes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    martes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    miercoles: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    jueves: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    viernes: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
  }

  days = Object.keys(this.availability)

  constructor() { }

  addDay(): void{
    this.teacher.advisorys.push({ day: '', selectedHourd: []})
  }

  updateHours(index: number): void{
    const selectedDay = this.teacher.advisorys[index].day;
    this.teacher.advisorys[index].availableHours = this.availability[selectedDay];
  }

  onSubmit(): void {
    console.log('Form data: ', this.teacher)
  }

  onCancel(): void {
    console.log('Form cancelled')
  }
}
