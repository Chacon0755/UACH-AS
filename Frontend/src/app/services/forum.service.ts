import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post, Response } from '../models/forum.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private posts: Post[] = [];

  constructor() { }

  getPosts(): Observable<Post[]>{
    return of(this.posts);
  }
  addPost(post: Post): Observable<Post>{
    post.id = this.posts.length + 1;
    this.posts.push(post);
    return of(post);
  }

  addResponse(postId: number, response: Response): Observable<Response> {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      if (!post.responses) {
        post.responses = [];
      }
      response.id = post.responses.length + 1;
      post.responses.push(response);
      return of(response);
    }
    throw new Error('no se encontro el post chavo')
  }
}
