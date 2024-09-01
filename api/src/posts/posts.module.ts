import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { AzureBlobService } from 'src/common/services/azure-blob.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, User])],
  controllers: [PostsController],
  providers: [PostsService, AzureBlobService, UsersService],
})
export class PostsModule {}
