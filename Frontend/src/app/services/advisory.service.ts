import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Advisory } from '../models/advisory.model';

@Injectable({
  providedIn: 'root'
})
export class AdvisoryService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }
  
  createAdvisory(advisory: Advisory): Observable<Advisory>{
    const payload = {
      id_alumno: advisory.studentId,
      id_docente: advisory.teacherId,
      id_materia: advisory.courseId,
      modalidad: advisory.mode,
      id_horario: advisory.scheduleId
    }
    return this.http.post<Advisory>(`${this.apiUrl}/asesorias`, payload)
  }
  
}
