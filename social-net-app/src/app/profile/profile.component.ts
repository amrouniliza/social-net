import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { User } from '../models';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  loggedInUser! : User;
  AuthUserSub! : Subscription;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.getRegisteredUser();

      if(params['userId'] !== this.loggedInUser.id) this.getUserProfile(params['userId']);
    });
  }

  getRegisteredUser() {
    this.AuthUserSub = this.authService.AuthenticatedUser$.subscribe({
      next : user => {
        if(user) this.loggedInUser = user;
      }
    })
  }

  getUserProfile(id: string) {
    // this.authService.getUserProfile(id).subscribe({
    //   next : user => this.user = user
    // })
  }
}