import { Like } from './like.model';
import { User } from './user.model';
import { Comment } from './comment.model';

export interface Post {
  id: string; // UUID unique du post
  content: string; // Contenu du post
  author: User; // UUID de l'auteur du post
  imageUrl?: string; // URL de l'image associée au post (si elle existe)
  createdAt: Date; // Date de création du post
  likes: Like[];
  comments: Comment[];
  hasUserLiked?: boolean | undefined;
}
