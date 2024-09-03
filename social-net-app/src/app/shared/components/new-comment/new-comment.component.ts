import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { Post, User } from '../../../models';
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
  authenticatedUser = input.required<User | null>();
  newCommentForm!: FormGroup;
  @ViewChild('newCommentTextarea')
  newCommentTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(private fb: FormBuilder) {
    this.newCommentForm = this.fb.group({
      content: this.fb.control(null, Validators.required),
    });
  }

  onSubmit(): void {}
}
