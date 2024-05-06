import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrl: './new-student.component.css'
})
export class NewStudentComponent {
  student = {
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    major: '',
    id: '',
  }

  majors = [
    'ICC'
  ]

  constructor(private router: Router){}

  onSubmit(): void {
    console.log('Form data: ', this.student)
    this.router.navigate(['/admin-home'])
  }

  onCancel() {
    console.log('Cancelao mijo')
    this.student = {
      name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    major: '',
    id: '',
    }
    this.router.navigate(['/admin-home'])
  }
}
