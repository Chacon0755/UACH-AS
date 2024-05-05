import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import (Router)

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<any>(null);
  // private currentUserSubject: BehaviorSubject<any>;


  // constructor(private http: HttpClient) {
  //   const currentUser = localStorage.getItem('currentUser');
  //   this.currentUserSubject = new BehaviorSubject<any>(currentUser ? JSON.parse(currentUser) : null);
  // }

  constructor(private router: Router){}

  login(username: string, password: string) {
    if (username === 'admin' && password === 'admin') {
      const userData = {
        name: 'Administrador',
        role: 'Administrator'
      };
      this.router.navigate(['admin-home'])
      this.user.next(userData);
    } else if (username === 'teacher' && password === 'teacher') {
      const UserData = {
        name: 'Maestro',
        role: "Teacher",
      };
      this.user.next(UserData)
      this.router.navigate(['teacher-home'])
    } else if (username === 'student' && password === 'student') {
      const UserData = {
        name: 'Estudiante',
        role: 'Student'
      };
      this.user.next(UserData)
      this.router.navigate(['student-home'])
    } else {
      console.error('te pasaste mijo')
      this.user.next(null)
    }
  }

  getUser() {
    return this.user.asObservable();
  }

  isAuthenticated() {
    return this.user.value != null;
  }

  logOut() {
    this.user.next(null);
  }
}
