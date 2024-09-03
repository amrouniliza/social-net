import { Component, input } from '@angular/core';
import { Comment } from '../../../models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, MatCardModule, DateAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input.required<Comment>();
}
