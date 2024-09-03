import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { CreateCommentDto, Post, User } from '../../../models';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCardAvatar } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { postsActions } from '../../../store/posts/actions/posts.actions';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatCardAvatar,
  ],
  templateUrl: './new-comment.component.html',
  styleUrl: './new-comment.component.scss',
})
export class NewCommentComponent {
  post = input.required<Post>();
  postsLoading = input.required<boolean>();
  authenticatedUser = input.required<User | null>();
  newCommentForm!: FormGroup;
  @ViewChild('newCommentTextarea')
  newCommentTextarea!: ElementRef<HTMLTextAreaElement>;
  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.newCommentForm = this.fb.group({
      content: this.fb.control(
        { value: null, disabled: false },
        Validators.required,
      ),
    });
    effect(() => {
      this.newCommentForm
        .get('content')
        ?.[this.postsLoading() ? 'disable' : 'enable']();
      if (!this.postsLoading()) {
        this.newCommentForm.get('content')?.setValue(null);
      }
    });
  }

  onSubmit(): void {
    if (this.newCommentForm.valid) {
      const newComment: CreateCommentDto = {
        ...this.newCommentForm.value,
      };
      this.store.dispatch(
        postsActions.commentPost({
          post: this.post(),
          comment: newComment,
        }),
      );
    }
  }
}
