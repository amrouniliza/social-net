import { Component, input } from '@angular/core';
import { Post } from '../../../models';
import { MatCardModule } from '@angular/material/card';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatCardModule,
    DateAgoPipe,
    MatIcon
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  post = input.required<Post>();

}
