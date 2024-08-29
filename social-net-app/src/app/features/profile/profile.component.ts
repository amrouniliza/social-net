import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NewPostForm, Post, User } from '../../models';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewPostComponent } from '../../shared/components/new-post/new-post.component';
import { FormGroup } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { PostAddEmitterService } from '../../services/emitters/post-add-emitter.service';
import { MatIconModule } from '@angular/material/icon';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PostComponent } from '../../shared/components/post/post.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    NewPostComponent,
    DateAgoPipe,
    PostComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  loggedInUser!: User;
  AuthUserSub!: Subscription;
  newPostForm!: FormGroup<NewPostForm>;
  posts = signal<Post[]>([]); // Signal pour stocker la liste des posts

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private postService: PostService,
    private postAddEmitter: PostAddEmitterService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.getRegisteredUser();

      if (params['userId'] !== this.loggedInUser.id)
        this.getUserProfile(params['userId']);
    });
    if (this.loggedInUser?.id) this.getProfilePosts(this.loggedInUser.id);
  }

  getRegisteredUser() {
    this.AuthUserSub = this.authService.AuthenticatedUser$.subscribe({
      next: (user) => {
        if (user) this.loggedInUser = user;
      },
    });
  }

  getUserProfile(id: string) {
    // this.authService.getUserProfile(id).subscribe({
    //   next : user => this.user = user
    // })
  }

  getProfilePosts(userId: string) {
    this.postService.getPostsByAuthor(userId).subscribe((posts: Post[]) => {
      this.posts.set(posts); // Met à jour le signal avec la liste des posts
    });
  }
}
