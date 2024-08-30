import { Component, input } from '@angular/core';
import { Post } from '../../../models';
import { MatCardModule } from '@angular/material/card';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MatCardModule, DateAgoPipe, MatIcon, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  post = input.required<Post>();
}
