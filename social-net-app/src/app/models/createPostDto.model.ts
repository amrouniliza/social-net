import { FormControl } from '@angular/forms';
import { Post } from './post.model';

export interface CreatePostDto
  extends Omit<Post, 'id' | 'author' | 'createdAt' | 'imageUrl'> {
  authorId: string;
  imageFile: File;
  [key: string]: string | File;
}

export type CreatePostDtoForm = {
  [field in keyof CreatePostDto]: FormControl<CreatePostDto[field] | null>;
};
