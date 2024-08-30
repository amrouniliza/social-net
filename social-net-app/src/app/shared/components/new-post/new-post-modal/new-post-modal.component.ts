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
import { CreatePostDto, CreatePostDtoForm, User } from '../../../../models';
import { Store } from '@ngrx/store';
import { postsActions } from '../../../../store/posts/actions/posts.actions';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  templateUrl: './new-post-modal.component.html',
  styleUrl: './new-post-modal.component.scss',
})
export class NewPostModalComponent {
  readonly dialogRef = inject(MatDialogRef<NewPostModalComponent>);
  newPostForm!: FormGroup;
  user = inject<User>(MAT_DIALOG_DATA);
  postImage!: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.newPostForm = this.fb.group<CreatePostDtoForm>({
      content: this.fb.control(null, Validators.required),
      authorId: this.fb.control(this.user.id, Validators.required),
      imageFile: this.fb.control(null),
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length === 1) {
      this.newPostForm.get('imageFile')?.setValue(input.files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      reader.onload = () => {
        this.postImage = reader.result;
      };
    }
  }

  onSubmit(): void {
    if (this.newPostForm.valid) {
      const newPost: CreatePostDto = {
        ...this.newPostForm.value,
      };
      this.store.dispatch(postsActions.createPost({ post: newPost }));
      this.closeModal();
    }
  }
}
