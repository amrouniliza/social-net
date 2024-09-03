import { Component, inject, input } from '@angular/core';
import { Comment, Post } from '../../../models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { postsActions } from '../../../store/posts/actions/posts.actions';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, MatCardModule, DateAgoPipe, MatIconModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input.required<Comment>();
  post = input.required<Post>();
  store = inject(Store);

  deleteComment() {
    this.store.dispatch(
      postsActions.deleteComment({
        post: this.post(),
        comment: this.comment(),
      }),
    );
  }
}
