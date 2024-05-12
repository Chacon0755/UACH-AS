import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Major } from '../models/major.model';

@Injectable({
  providedIn: 'root'
})
export class MajorService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createMajor(major: Major): Observable<Major>{
    const payload = {
      Id_Carreras: major.id,
      Nombre_Carrera: major.name
    };
    return this.http.post<Major>(`${this.apiUrl}/carrera`, payload);
  }
  getMajors(): Observable<Major[]>{
    return this.http.get<Major[]>(`${this.apiUrl}/carrera`)
  }

}
