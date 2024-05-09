import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ForumService } from '../services/forum.service';
import { Router } from '@angular/router';
import { Post, Response } from '../models/forum.model';
import { Course } from '../models/course.model';
import { TeacherService } from '../services/teacher.service';
import { Teacher } from '../models/teacher.model';


@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrl: './teacher-home.component.css'
})
export class TeacherHomeComponent implements OnInit {
  teacher: Teacher | null = null;
  posts: Post[] = [];
  newPostContent: string = '';
  newResponseContent: string = '';
  userName: string = '';
  userRole: string = 'teacher';
  userImageUrl: string | ArrayBuffer | null = null;
  courses: Course[] = [];

  constructor(private authService: AuthService, private forumService: ForumService, private router: Router, private teacherService: TeacherService) { }
  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.userName = user.name;
      this.userRole = user.role;
    });
    this.loadTeacherData();
  }
  
  loadPosts(): void{
    this.forumService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  postPublication(): void {
    if (this.newPostContent.trim()) {
      const newPost: Post = {
        id: 0,
        author: this.userName,
        role: this.userRole,
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

  reply(postId: number, postIndex: number): void {
    if (this.newResponseContent.trim()) {
      const response: Response = {
        id: 0,
        author: this.userName,
        role: this.userRole,
        content: this.newResponseContent,
        createdAt: new Date()
      };
      this.forumService.addResponse(postId, response).subscribe(res => {
        this.posts[postIndex].responses?.push(res);
        this.newPostContent = '';
      });
    }
  }

  onFileSelectedEvent(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  logOut(): void{
    this.router.navigate(['/login'])
  }

  loadCurses(): void {
    const teacherId = 1; //cambiar por el del profesor
    this.teacherService.getCourses(teacherId).subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => console.error('nel nel ', error)
    });
  }

  loadTeacherData(): void{
    const teacherId = 1; //cambiarla con el servicio de autentificacion
    this.teacherService.getTeacherDataById(teacherId).subscribe({
      next: (teacherData) => {
        this.teacher = teacherData;
      },
      error: (error) => console.error('ya no puedo Martha ', error),
    });
  }


}


