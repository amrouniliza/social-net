import { Post } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  user: UserEntity;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
}
