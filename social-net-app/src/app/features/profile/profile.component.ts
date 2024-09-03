import {
  Component,
  inject,
  Injector,
  Input,
  OnInit,
  runInInjectionContext,
  Signal,
} from '@angular/core';
import { Post, User } from '../../models';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewPostComponent } from '../../shared/components/new-post/new-post.component';
import { MatIconModule } from '@angular/material/icon';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PostComponent } from '../../shared/components/post/post.component';
import { Store } from '@ngrx/store';
import {
  selectAllPosts,
  selectPostLoading,
} from '../../store/posts/selectors/posts.selectors';
import { CommonModule } from '@angular/common';
import { postsActions } from '../../store/posts/actions/posts.actions';
import { selectUser } from '../../store/auth/selectors/auth.selectors';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
  #userService = inject(UserService);
  #store = inject(Store);
  #injector = inject(Injector);
  @Input() consultedProfileId!: string;
  authenticatedUser!: Signal<User | null>;
  profileUser!: Signal<User | null>;
  $posts!: Signal<Post[]>;
  $postsLoading!: Signal<boolean>;

  ngOnInit(): void {
    this.$postsLoading = this.#store.selectSignal(selectPostLoading);
    this.getAuthenticatedUser();
    this.getProfilePosts(this.consultedProfileId);
    if (this.consultedProfileId !== this.authenticatedUser()?.id) {
      this.getUserProfile(this.consultedProfileId);
    } else {
      this.profileUser = this.authenticatedUser;
    }
  }

  getAuthenticatedUser() {
    this.authenticatedUser = this.#store.selectSignal(selectUser);
  }

  getUserProfile(id: string) {
    runInInjectionContext(this.#injector, () => {
      this.profileUser = toSignal(this.#userService.getUser(id), {
        initialValue: null,
      });
    });
  }

  getProfilePosts(userId: string) {
    this.#store.dispatch(postsActions.loadPostsByAuthor({ authorId: userId }));
    this.$posts = this.#store.selectSignal(selectAllPosts);
  }
}
