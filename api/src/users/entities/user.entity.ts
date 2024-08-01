import { Friendship } from 'src/friendships/entities/friendship.entity';
import { Like } from 'src/likes/entities/like.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  Unique,
  CreateDateColumn,
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

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

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

  @CreateDateColumn()
  createdAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
