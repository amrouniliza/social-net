import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Unique(['user', 'post']) // Contraintes uniques
export class LikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => PostEntity, (post) => post.likes, { onDelete: 'CASCADE' })
  post: PostEntity;
}
