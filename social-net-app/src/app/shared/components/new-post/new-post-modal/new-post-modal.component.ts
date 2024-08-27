import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PostService } from '../../../../services/post.service';
import { Post, User } from '../../../../models';

@Component({
  selector: 'app-new-post-modal',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-post-modal.component.html',
  styleUrl: './new-post-modal.component.scss'
})
export class NewPostModalComponent {

  readonly dialogRef = inject(MatDialogRef<NewPostModalComponent>);
  newPostForm!: FormGroup
  user = inject<User>(MAT_DIALOG_DATA);

  constructor(
    private fb: FormBuilder,
    private postService: PostService
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
    console.log('submit');
    console.log(this.newPostForm.value);
    const newPost: Post = {
      ...this.newPostForm.value,
    }
    if (this.newPostForm.valid) {
      this.postService.createPost(this.newPostForm.value).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          // Logique supplémentaire après la création du post
        },
        error: (error) => {
          console.error('Error creating post:', error);
          // Gérer l'erreur
        }
      })
      this.closeModal();
    }
  }

}
