import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Post, User } from '../../models';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewPostComponent } from '../../shared/components/new-post/new-post.component';
import { MatIconModule } from '@angular/material/icon';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PostComponent } from '../../shared/components/post/post.component';
import { Store } from '@ngrx/store';
import { selectAllPosts } from '../../store/posts/selectors/posts.selectors';
import { CommonModule } from '@angular/common';
import { postsActions } from '../../store/posts/actions/posts.actions';
import { selectUser } from '../../store/auth/selectors/auth.selectors';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    NewPostComponent,
    DateAgoPipe,
    PostComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  loggedInUser$!: Observable<User | null>;
  loggedInUser!: User;
  profileUser!: User;
  posts$!: Observable<Post[]>;
  consultedProfileId!: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.getRegisteredUser();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.consultedProfileId = params['userId'];
    });
    this.getProfilePosts(this.consultedProfileId);
    if (this.consultedProfileId === this.loggedInUser.id) {
      this.getUserProfile(this.consultedProfileId);
    } else {
      this.profileUser = this.loggedInUser;
    }
  }

  getRegisteredUser() {
    this.loggedInUser$ = this.store.select(selectUser);
    this.loggedInUser$.subscribe((user) => (this.loggedInUser = user!));
  }

  getUserProfile(id: string) {
    this.userService.getUser(id).subscribe({
      next: (user) => (this.profileUser = user),
    });
  }

  getProfilePosts(userId: string) {
    this.store.dispatch(postsActions.loadPostsByAuthor({ authorId: userId }));
    this.posts$ = this.store.select(selectAllPosts);
  }
}
