import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css'
})
export class ViewCourseComponent implements OnInit {
  allCourses: any[] = [];
  displayedColumns: any[] = [
    'Id_Materias', 'N_Carr', 'N_Sem', 'N_Mat'
  ];

  constructor(private courseService: CourseService) { }
  ngOnInit(): void {
    this.loadCoursesAndMajorName();
  }

  loadCoursesAndMajorName(): void {
    this.courseService.getCoursesAndMajorName().subscribe({
      next: (allCourses) => {
        this.allCourses = allCourses;
        console.log('Materias: ', this.allCourses);
      },
      error: (error) => console.error('Error cargando materias: ', error)
    });
  }

}
