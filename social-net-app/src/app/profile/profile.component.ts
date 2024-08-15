import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { User } from '../models';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  loggedInUser! : User;
  AuthUserSub! : Subscription;
  readonly dialog = inject(MatDialog);

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

  openNewPostDialog() {
    // const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    //   data: {name: this.name(), animal: this.animal()},
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if (result !== undefined) {
    //     this.animal.set(result);
    //   }
    // });
 }
}