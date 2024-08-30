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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email'])
export class UserEntity implements User {
  @ApiProperty({
    example: 'a7d8b6a3-32d1-4c0a-b5e7-8e0f0b1b2b3b',
    description: 'The id of the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'The username of the user',
  })
  @Column()
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @Column()
  email: string;


  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;
  
  @Column({ nullable: true })
  backgroundUrl: string;

  @ApiProperty({
    example: 'I am a user',
    description: 'The bio of the user',
  })
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
