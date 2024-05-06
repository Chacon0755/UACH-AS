import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface Post {
  author: string;
  content: string;
  responses?: Response[];
}

interface Response {
  author: string;
  content: string;
}

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.css'
})

export class StudentHomeComponent implements OnInit {
  
  posts: Post[] = [];
  newPostContent: string = '';
  newResponseContent: string = '';
  userName: string = '';
  userImageURL: string | ArrayBuffer | null = null;

  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    this.loadPosts();
    this.authService.getUser().subscribe(user => {

      if (user) {
        this.userName = user.name;
      } else {
        this.userName = 'Invitado'
      }
    })
  }

  onFileSelectedevent(event: Event) {
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
    this.posts = [
      {
        author: 'Brandon',
        content: 'Holaaaaaa',
        responses: [
          {
            author: 'Ana',
            content: "Ya me harte"
          }
        ]
      }
    ]
  }

  postPublication(): void{
    if (this.newPostContent.trim()) {
      this.posts.push({
        author: 'user',
        content: this.newPostContent,
        responses: []
      });
      this.newPostContent = '';
    }
  }

  reply(postIndex: number): void {
    if (this.newResponseContent.trim()) {
      const post = this.posts[postIndex];
      if (post.responses) {
        post.responses.push({
          author: 'actual',
          content: this.newResponseContent
        });
      } else {
        post.responses = [{
          author: 'actual',
          content: this.newResponseContent
        }];
      }
      this.newResponseContent = '';
    }
  }

}
