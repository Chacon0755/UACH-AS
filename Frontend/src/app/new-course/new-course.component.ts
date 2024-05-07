import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';
import { MajorService } from '../services/major.service';
import { Major } from '../models/major.model';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.css'
})
export class NewCourseComponent implements OnInit {
  course = {
    name: '',
    majorCode: 0,
    code: 0
  }
  allMajors: Major[] = [];

  constructor(private router: Router, private majorService: MajorService, private courseService: CourseService) { }

  ngOnInit() {
    this.loadMajors();
  }

  loadMajors() {
    this.majorService.getMajors().subscribe({
      next: (allMajors) => {
        this.allMajors = allMajors
      },
      error: (error) => console.error('sad ', error)
    })
  }
  
  onSubmit() {
    this.courseService.createCourse(this.course).subscribe({
      next: (course) => {
        console.log('superyaaay', course);
        this.router.navigate(['/admin-home'])
      },
      error: (error) => console.error('chale', error)
    })
  }

  onCancel() {
    console.log('ay que menso deberas');
    this.course = {
      name: '',
      majorCode: 0,
      code: 0
    }
    this.router.navigate(['/admin-home'])
  }
}
