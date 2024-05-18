import { Component, OnInit } from '@angular/core';
import { Admin } from '../models/admin.model';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrl: './new-admin.component.css'
})
export class NewAdminComponent {
  admin: Admin = {
    id: 0,
    email: '',
    password: '',
    name: '',
    lastName1: '',
    lastName2: '',
    rol: '',
    profilePicture: '',
  }
  constructor(private router: Router, private adminService: AdminService) { }
  
  onSubmit(): void {
    this.adminService.createAdmin(this.admin).subscribe({
      next: (response) => {
        console.log('Admin creado correctamente', response);
        this.router.navigate(['/admin-home'])
      },
      error: (error) => {
        console.error('Error al crear admin', error)
      }
    });
  }

  //5PoOJ51T

  onCancel(): void {
    console.log("Cancelao")
    this.admin = {
      id: 0,
    email: '',
    password: '',
    name: '',
    lastName1: '',
    lastName2: '',
      rol: '',
    profilePicture: '',
    }
    this.router.navigate(['admin-home'])
  }
}
