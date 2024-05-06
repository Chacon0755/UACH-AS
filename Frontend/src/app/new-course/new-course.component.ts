import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.css'
})
export class NewCourseComponent {
  course = {
    major: '',
    name: '',
    code: ''
  }
  allMajors = ['ICC']

  constructor(private router: Router) { }
  
  onSubmit() {
    console.log('Course data', this.course);
    this.router.navigate(['/admin-home'])
  }

  onCancel() {
    console.log('ay que menso deberas');
    this.course = {
      major: '',
      name: '',
      code: ''
    }
    this.router.navigate(['/admin-home'])
  }
}
