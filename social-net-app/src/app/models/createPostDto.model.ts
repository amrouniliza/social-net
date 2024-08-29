import { FormControl } from '@angular/forms';

export interface CreatePostDto {
  content: string;
  authorId: string;
}

export type NewPostForm = {
  [field in keyof CreatePostDto]: FormControl<CreatePostDto[field] | null>;
};
