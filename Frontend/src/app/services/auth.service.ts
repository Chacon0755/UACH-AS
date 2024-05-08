import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import (Router)

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<any>(null);
  

  constructor(private router: Router){}

  login(username: string, password: string) {
    const role = this.determineRole(username)
    if (role === 'admin' && password === 'admin') {
      const userData = {
        name: 'Administrador',
        role: 'Administrator'
      };
      this.router.navigate(['admin-home'])
      this.user.next(userData);
    } else if (role === 'teacher' && password === 'teacher') {
      const UserData = {
        name: 'Maestro',
        role: "Teacher",
      };
      this.user.next(UserData)
      this.router.navigate(['teacher-home'])
    } else if (role === 'student' && password === 'student') {
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

  private determineRole(username: string): 'student' | 'teacher' | 'admin' {
    const firstchar = username.charAt(0);
    if (username === 'admin') {
      return 'admin'
    }
    else if(!isNaN(parseInt(firstchar, 10))) {
      return 'student';
    }
    else if (firstchar.toLowerCase() !== firstchar.toUpperCase()) {
      return 'teacher'
    }
    throw new Error('nop')
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
