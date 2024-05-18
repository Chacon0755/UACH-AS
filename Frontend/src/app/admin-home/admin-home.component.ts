import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
//
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  userName: string = '';
  userImageURL: string | ArrayBuffer | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onFileSelectedEvent(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userImageURL = reader.result;
      };
      reader.readAsDataURL(file)
    }
  }

  logOut() {
    this.router.navigate(['/login'])
  }

  ngOnInit() {
    
  }
}
