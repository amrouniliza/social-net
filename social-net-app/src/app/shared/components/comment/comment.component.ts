import { Component, input } from '@angular/core';
import { Comment } from '../../../models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input.required<Comment>();
}
