import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPostModalComponent } from './new-post-modal/new-post-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {

  readonly dialog = inject(MatDialog);

  openNewPostDialog() {
    const dialogRef = this.dialog.open(NewPostModalComponent, {
      width: '50%',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
      }
    });
  }

}
