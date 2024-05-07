import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Major } from '../models/major.model';

@Injectable({
  providedIn: 'root'
})
export class MajorService {
  private apiUrl = '';

  constructor(private http: HttpClient) { }

  createMajor(major: Major): Observable<Major>{
    return this.http.post<Major>(this.apiUrl, major);
  }
  getMajors(): Observable<Major[]>{
    return this.http.get<Major[]>('${this.apiUrl)/majors')
  }

}
