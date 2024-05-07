import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MajorService } from '../services/major.service';
import { Major } from '../models/major.model';

@Component({
  selector: 'app-new-major',
  templateUrl: './new-major.component.html',
  styleUrl: './new-major.component.css'
})
export class NewMajorComponent {
  major: Major = {
    name: '',
    code: 0,
    plan: ''
  }

  constructor(private router: Router, private majorService: MajorService) { }
  
  onSubmit(): void {
    this.majorService.createMajor(this.major).subscribe({
      next: (major) => {
        console.log('yaaay', major);
        this.router.navigate(['/admin-home']);
      },
      error: (error) => {
        console.error('rayos:(', error);
      }
    });
  }

  onCancel() {
    console.log('bai bai')
    this.major = {
      name: '',
      code: 0,
      plan: ''
    }
    this.router.navigate(['/admin-home'])
  }
}
