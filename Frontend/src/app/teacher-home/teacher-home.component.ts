import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ForumService } from '../services/forum.service';
import { Router } from '@angular/router';
import { Post } from '../models/forum.model';
import { Course } from '../models/course.model';
import { TeacherService } from '../services/teacher.service';
import { Teacher } from '../models/teacher.model';


@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrl: './teacher-home.component.css'
})
export class TeacherHomeComponent implements OnInit {
  teacher: Teacher = {
    id: 0,
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    majorId: 0,
    courseId: 0,
    courseIds: [],
    scheduleIds: [],
    role: 'teacher',
    profilePicture: '',
    password: ''
  };
  selectedFile: File | null = null;
  posts: Post[] = [];
  newPostContent: string = '';
  newResponseContent: string = '';
  courses: Course[] = [];
    



  constructor(private authService: AuthService, private forumService: ForumService, private router: Router, private teacherService: TeacherService) { }
  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.loadTeacherData(userDetails.id);
      this.loadProfileImage(userDetails.id);
      this.loadCurses()
    }
  }
  
  loadProfileImage(teacherId: number): void{
    this.teacherService.getProfilePicture(teacherId).subscribe(blob => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.teacher.profilePicture = e.target.result;
        console.log(this.teacher.profilePicture)
      };
      reader.readAsDataURL(blob);
      
    })
  }

  loadTeacherData(teacherId: number): void{
    this.teacherService.getTeacherDataById(teacherId).subscribe({
      next: (teacher) => {
        if (teacher) {
          const teacherData = teacher[0];
          this.teacher = {
            id: teacherData.Id_docente,
            name: teacherData.nombre_doc,
            lastName1: teacherData.Apellido,
            lastName2: teacherData.apei2,
            email: teacherData.correo,
            majorId: teacherData.id_carrera_mat,
            courseId: 0,
            courseIds: teacherData.id_mat_as,
            scheduleIds: [],
            role: teacherData.rol_doc,
            profilePicture: '',
            password: ''
          }
          console.log('Teacher de DB: ', teacher);
          console.log('Teacher Front: ', this.teacher);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del docente: ', error)
      }
    });
  }

  loadPosts(): void{
    this.forumService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  postPublication(): void{
    if (this.newPostContent.trim()) {
      const newPost: Post = {
        id: 0,
        author: this.teacher.name,
        role: this.teacher.role,
        content: this.newPostContent,
        createdAt: new Date(),
        responses: []
      };
      this.forumService.addPost(newPost).subscribe(post => {
        this.posts.push(post);
        this.newPostContent = '';
      });
    }
  }

  reply(postId: number, postIndex: number, archivoAdjunto: File | null): void {
    if (this.newResponseContent.trim()) {
      //const response: Response = {
      const formData = new FormData();
      formData.append('content', this.newResponseContent);
      if (archivoAdjunto) {
        formData.append('archivoAdjunto', archivoAdjunto);
      }
      //   id: 0,
      //   author: this.userName,
      //   role: this.userRole,
      //   content: this.newResponseContent,
      //   createdAt: new Date()
      // };
      // this.forumService.addResponse(postId, response).subscribe(res => {
      //   this.posts[postIndex].responses?.push(res);
      //   this.newResponseContent = ';'
      // });
      this.forumService.addResponse(postId, formData).subscribe(res => {
        this.posts[postIndex].responses?.push(res);
        this.newResponseContent = '';
    
      });
    }
  }



  // reply(postId: number, postIndex: number): void {
  //   if (this.newResponseContent.trim()) {
  //     const response: Response = {
  //       id: 0,
  //       author: this.userName,
  //       role: this.userRole,
  //       content: this.newResponseContent,
  //       createdAt: new Date()
  //     };
  //     this.forumService.addResponse(postId, response).subscribe(res => {
  //       this.posts[postIndex].responses?.push(res);
  //       this.newPostContent = '';
  //     });
  //   }
  // }

  onFileSelectedEvent(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.teacher.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);

    this.onUpload();
  }

  onUpload(): void{
    if (this.selectedFile) {
      const teacherId = this.teacher.id;
      console.log(teacherId)
      this.teacherService.uploadProfileImage(teacherId, this.selectedFile).subscribe({
        next: (response) => {
          console.log('Foto subida correctamente ', response)
        },
        error: (error) => {
          console.error('Error al subir la foto de perfil ', error);
        }
      });
    }
  }
  
  logOut(): void{
    this.router.navigate(['/login'])
  }

  loadCurses(): void {
    const teacherId = this.teacher.id; //cambiar por el del profesor
    this.teacherService.getCourses(teacherId).subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log(courses)
      },
      error: (error) => console.error('nel nel ', error)
    });
  }

}


