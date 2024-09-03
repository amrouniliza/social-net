import { Component, inject, Input, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPostModalComponent } from './new-post-modal/new-post-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  readonly dialog = inject(MatDialog);
  @Input()
  profileUser!: Signal<User | null>;

  openNewPostDialog() {
    this.dialog.open<NewPostModalComponent>(NewPostModalComponent, {
      width: '50%',
      data: this.profileUser(),
    });
  }
}
