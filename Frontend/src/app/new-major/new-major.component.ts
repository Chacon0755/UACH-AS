import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-major',
  templateUrl: './new-major.component.html',
  styleUrl: './new-major.component.css'
})
export class NewMajorComponent {
  major = {
    name: '',
    code: '',
    plan: ''
  }

  constructor(private router: Router) { }
  
  onSubmit(): void {
    console.log('Form data: ', this.major)
    this.router.navigate(['/admin-home'])
  }

  onCancel() {
    console.log('bai bai')
    this.major = {
      name: '',
      code: '',
      plan: ''
    }
    this.router.navigate(['/admin-home'])
  }
}
