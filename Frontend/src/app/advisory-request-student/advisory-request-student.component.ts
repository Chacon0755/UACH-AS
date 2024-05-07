import { Component, OnInit } from '@angular/core';
import { AdvisoryService } from '../services/advisory.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Major } from '../models/major.model';
import { Course } from '../models/course.model';
import { Teacher } from '../models/teacher.model';


@Component({
  selector: 'app-advisory-request-student',
  templateUrl: './advisory-request-student.component.html',
  styleUrl: './advisory-request-student.component.css'
})
export class AdvisoryRequestStudentComponent implements OnInit {
  advisoryForm: FormGroup;
  majors: Major[] = [];
  courses: Course[] = [];
  teachers: Teacher[] = [];
  modes = [{id: 'Presencial', name: 'Presencial'}, {id: 'Virtual', name: 'Virtual'}]
  times = [];

  constructor(private advisoryService: AdvisoryService, private fb: FormBuilder, private router: Router) {
    this.advisoryForm = this.fb.group({
      major: [''],
      courses: [''],
      teacher: [''],
      mode: [''],
      days: [''],
      time: [''],
    });
  }
  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData() {
    this.advisoryService.getMajors().subscribe(data => this.majors = data);
    this.advisoryService.getCourses().subscribe(data => this.courses = data);
    this.advisoryService.getTeachers().subscribe(data => {
      this.teachers = data;
      this.advisoryForm.controls['teacher'].valueChanges.subscribe(teacherId => {
        this.loadTimes(teacherId);
      });
    });
  }
  loadTimes(teacherId: number) {
    this.advisoryService.getTimesByTeacherId(teacherId).subscribe(data => this.times = data)
  }

  submitForm() {
    if (this.advisoryForm.valid) {
      this.advisoryService.createAdvisory(this.advisoryForm.value, 'student').subscribe({
        next: response => {
          console.log('Asesoria creada con exito', response);
          this.router.navigate(['/student-home'])
        },
        error: err => {
          console.error('Error solicitando asesoria', err)
        }
      });
    }
  }

  onCancel(){
    this.router.navigate(['/student-home'])
  }
}
