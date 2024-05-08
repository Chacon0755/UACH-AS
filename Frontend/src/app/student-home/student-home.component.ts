import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { Post, Response } from '../models/forum.model';
import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.css'
})

export class StudentHomeComponent implements OnInit {
  student: Student | null = null;
  posts: Post[] = [];
  newPostContent: string = '';
  newResponseContent: string = '';
  userName: string = '';
  userImageURL: string | ArrayBuffer | null = null;
  userRole: string = 'student';
  courses: string[] = []

  constructor(private authService: AuthService, private router: Router, private forumService: ForumService, private studentService: StudentService) { }
  
  ngOnInit(): void {
    this.loadPosts();
    this.authService.getUser().subscribe(user => {
      this.userName = user.name;
      this.userRole = user.role;
    });
    this.loadStudentData();
  }

  onFileSelectedEvent(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userImageURL = reader.result;
      };
      reader.readAsDataURL(file)
    }
  }

  logOut() {
    this.router.navigate(['/login'])
  }

  loadPosts(): void{
    this.forumService.getPosts().subscribe(posts => {
      this.posts = posts;
    })
  }

  postPublication(): void{
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
        this.newResponseContent = ';'
      });
    }
  }

  loadStudentData(): void{
    const studentId = 1; //cambiar
    this.studentService.getStudentDataById(studentId).subscribe({
      next: (studentData) => {
        this.student = studentData;
      },
      error: (error) => console.error('Sigo sin poder Martha ', error),
    });
  }
}
