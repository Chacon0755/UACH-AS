import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MajorService } from '../services/major.service';
import { Major } from '../models/major.model';

@Component({
  selector: 'app-new-major',
  templateUrl: './new-major.component.html',
  styleUrl: './new-major.component.css'
})
export class NewMajorComponent implements OnInit{
  major: Major = {
    id: 0,
    name: '',
  }

  constructor(private router: Router, private majorService: MajorService) { }
  
  ngOnInit(): void {
      console.log('Al iniciar: ', this.major)
  }

  onSubmit(): void {
    console.log('Al enviar: ', this.major);
    if (!this.major.id || !this.major.name) {
      console.error('ID no proporcionado', this.major.id, ' ',this.major.name);
      return
    }
    this.majorService.createMajor(this.major).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor: ', response);
        this.router.navigate(['/admin-home']);
      },
      error: (error) => {
        console.error('Error al crear carrera: ', error.message);
      }
    });
  }


  onCancel() {
    console.log('bai bai')
    this.major = {
      id: 0,
      name: '',
    }
    this.router.navigate(['/admin-home'])
  }
}
