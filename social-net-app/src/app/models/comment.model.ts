import { Post } from './post.model';
import { User } from './user.model';

export interface Comment {
  id: string;
  content: string;
  author: User;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}
