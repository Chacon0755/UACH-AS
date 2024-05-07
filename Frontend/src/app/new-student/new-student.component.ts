import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { MajorService } from '../services/major.service';
import { Student } from '../models/student.model';
import { Major } from '../models/major.model';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrl: './new-student.component.css'
})
export class NewStudentComponent implements OnInit {
  student: Student = {
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    major: '',
    schoolId: 3,
  }

  majors: Major[] = []

  constructor(private router: Router, private studentService: StudentService, private majorService: MajorService){}

  ngOnInit(): void {
      
  }

  loadMajors() {
    this.majorService.getMajors().subscribe({
      next: (majors) => {
        this.majors = majors;
      },
      error: (error) => console.error('ya estoy cansado ', error)
    });
  }

  onSubmit(): void {
    this.studentService.createStudent(this.student).subscribe({
      next: (student) => {
        console.log('si se pudo ayayay', student);
        this.router.navigate(['/admin-home'])
      },
      error: (error) => {
        console.error('no se armo oiga')
      }
    });
  }

  onCancel() {
    console.log('Cancelao mijo')
    this.student = {
      name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    major: '',
    schoolId: 3,
    }
    this.router.navigate(['/admin-home'])
  }
}
