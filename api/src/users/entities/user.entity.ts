import { Friendship } from 'src/friendships/entities/friendship.entity';
import { LikeEntity } from 'src/likes/entities/like.entity';
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
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_entity')
@Unique(['email'])
export class User extends BaseEntity {
  @ApiProperty({
    example: 'a7d8b6a3-32d1-4c0a-b5e7-8e0f0b1b2b3b',
    description: 'The id of the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
  avatarUrl: string | null;
  
  @Column({ nullable: true })
  backgroundUrl: string | null;

  @ApiProperty({
    example: 'I am a user',
    description: 'The bio of the user',
  })
  @Column({ nullable: true })
  bio: string | null;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friendships: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  friendOf: Friendship[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
