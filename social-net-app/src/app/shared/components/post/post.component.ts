import { Component, inject, input, ViewChild } from '@angular/core';
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
import { NewCommentComponent } from '../new-comment/new-comment.component';

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
    NewCommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  post = input.required<Post>();
  postsLoading = input.required<boolean>();
  authenticatedUser = input.required<User | null>();
  readonly store = inject(Store);
  @ViewChild(NewCommentComponent) newCommentComponent!: NewCommentComponent;

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

  focusNewCommentTextArea() {
    this.newCommentComponent.newCommentTextarea.nativeElement.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
    this.newCommentComponent.newCommentTextarea.nativeElement.focus();
  }
}
