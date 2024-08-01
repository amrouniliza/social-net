import { User } from 'src/users/interfaces';

export interface Post {
  id: string;
  content: string;
  image: string;
  createdAt: Date;
  author: User;
}
