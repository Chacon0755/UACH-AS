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

  editMajor(id: number, major: Major): Observable<any>{
    const payload = {
    
      Nombre_Carrera: major.name
    }
    return this.http.put<any>(`${this.apiUrl}/carrera/${id}`, payload)
  }
  getMajors(): Observable<Major[]>{
    return this.http.get<Major[]>(`${this.apiUrl}/carrera`)
  }

  getAllIds(): Observable<number[]>{
    return this.http.get<number[]>(`${this.apiUrl}/carreras/ids`)
  }

}
