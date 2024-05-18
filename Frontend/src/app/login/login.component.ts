import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        console.log('Token: ', response.token)

        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const role = payload.role;
        console.log('rol: ', role)
        console.log('getToken(): ',this.authService.getToken());

        if (role === 'admin') {
          console.log('si se logro')
          this.router.navigate(['/admin-home']);
        } else if (role === 'student') {
          this.router.navigate(['/student-home']);
        } else if (role === 'teacher') {
          this.router.navigate(['teacher-home']);
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesion ', error);
      }
    });
  }


}
