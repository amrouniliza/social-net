import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.friendships)
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.friendOf)
  friend: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
