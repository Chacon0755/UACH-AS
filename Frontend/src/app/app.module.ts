import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { FormsModule } from '@angular/forms';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { NewTeacherComponent } from './new-teacher/new-teacher.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button';
import { NewMajorComponent } from './new-major/new-major.component';
import { NewCourseComponent } from './new-course/new-course.component';
import { AdvisoryRequestStudentComponent } from './advisory-request-student/advisory-request-student.component' 
import { HttpClientModule } from '@angular/common/http';
import { StudentHomeComponent } from './student-home/student-home.component';
import { EditMajorComponent } from './edit-major/edit-major.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminHomeComponent,
    StudentHomeComponent,
    TeacherHomeComponent,
    NewTeacherComponent,
    NewStudentComponent,
    NewMajorComponent,
    NewCourseComponent,
    AdvisoryRequestStudentComponent,
    EditMajorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
