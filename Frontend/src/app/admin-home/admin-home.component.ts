import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  userName: string = '';

  constructor(private authService: AuthService) { }
  
  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.userName = user.name;
      // if (user) {
      //   this.userName = user.name;
      // } else {
      //   this.userName = 'Invitado'
      // }
    })
  }
}
