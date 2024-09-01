import { User } from "src/users/entities/user.entity";

export interface Post {
  id: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  author: User;
}
