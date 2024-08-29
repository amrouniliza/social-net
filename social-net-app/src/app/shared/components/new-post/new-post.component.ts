import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPostModalComponent } from './new-post-modal/new-post-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../models';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  readonly dialog = inject(MatDialog);
  user = input.required<User>();

  openNewPostDialog() {
    this.dialog.open<NewPostModalComponent>(NewPostModalComponent, {
      width: '50%',
      data: this.user(),
    });
  }
}
