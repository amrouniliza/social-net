import { Component, inject, input } from '@angular/core';
import { Post, User } from '../../../models';
import { MatCardModule } from '@angular/material/card';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { postsActions } from '../../../store/posts/actions/posts.actions';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatCardModule,
    DateAgoPipe,
    MatIcon,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  post = input.required<Post>();
  authenticatedUser = input.required<User | null>();
  readonly store = inject(Store);

  likeOrUnlike() {
    const like = this.post().likes.find(
      (like) => like.user.id === this.authenticatedUser()?.id,
    );
    if (like) {
      this.store.dispatch(postsActions.unlikePost({ post: this.post(), like }));
    } else {
      this.store.dispatch(postsActions.likePost({ post: this.post() }));
    }
  }
}
