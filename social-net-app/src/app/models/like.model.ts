import { Post } from './post.model';
import { User } from './user.model';

export interface Like {
  id: string;
  user: User;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}
