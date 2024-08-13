import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    console.log('Logout');
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['login']),
    });
  }

}
