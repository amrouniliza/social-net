import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { AzureBlobService } from 'src/common/services/azure-blob.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  controllers: [PostsController],
  providers: [PostsService, AzureBlobService],
})
export class PostsModule {}
