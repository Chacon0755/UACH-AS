import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  
  login(email: string, password: string): Observable<any> {
    console.log(email, password)
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    if (token === null) {
      throw new Error('No token found in localStorage');
    }
    return token
  }

  removeToken(): void {
    localStorage.removeItem('token')
  }
}
