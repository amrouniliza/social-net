import { User } from 'src/users/interfaces';

export interface Post {
  id: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  author: User;
}
