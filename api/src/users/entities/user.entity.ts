import { Friendship } from 'src/friendships/entities/friendship.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
import { User } from 'src/users/interfaces';

@Entity()
@Unique(['email'])
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  // @Column({ nullable: true })
  // profilePicture: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @ManyToMany(() => UserEntity, (user) => user.friends)
  @JoinTable()
  friends: UserEntity[];

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friendships: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  friendOf: Friendship[];

  toJSON() {
    return instanceToPlain(this);
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
