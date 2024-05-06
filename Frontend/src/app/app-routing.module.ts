import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
// import { authGuard } from './auth.guard';
import { NewTeacherComponent } from './new-teacher/new-teacher.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { NewMajorComponent } from './new-major/new-major.component';
import { NewCourseComponent } from './new-course/new-course.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin-home', component: AdminHomeComponent},
  { path: 'student-home', component: StudentHomeComponent},
  { path: 'teacher-home', component: TeacherHomeComponent },
  { path: 'new-teacher', component: NewTeacherComponent },
  { path: 'new-student', component: NewStudentComponent },
  { path: 'new-major', component: NewMajorComponent },
  { path: 'new-course', component: NewCourseComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
