import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Post, User } from '../../../../models';
import { Store } from '@ngrx/store';
import { postsActions } from '../../../../store/posts/actions/posts.actions';

@Component({
  selector: 'app-new-post-modal',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-post-modal.component.html',
  styleUrl: './new-post-modal.component.scss',
})
export class NewPostModalComponent {
  readonly dialogRef = inject(MatDialogRef<NewPostModalComponent>);
  newPostForm!: FormGroup;
  user = inject<User>(MAT_DIALOG_DATA);

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.newPostForm = this.fb.group({
      content: ['', Validators.required],
      authorId: [this.user.id, Validators.required],
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const newPost: Post = {
      ...this.newPostForm.value,
    };
    if (this.newPostForm.valid) {
      this.store.dispatch(postsActions.createPost({ post: newPost }));
      this.closeModal();
    }
  }
}
