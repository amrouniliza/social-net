import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<PostEntity>;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(PostEntity), useClass: Repository },
        { provide: getRepositoryToken(UserEntity), useClass: Repository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto = {
        content: 'Test content',
        authorId: '1',
      };
      const author = new UserEntity({ username: 'john' });
      const createdPost = new PostEntity();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(author);
      jest.spyOn(postRepository, 'create').mockReturnValue(createdPost);
      jest.spyOn(postRepository, 'save').mockResolvedValue(createdPost);

      const result = await service.create(createPostDto);

      expect(result).toBe(createdPost);
      expect(postRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createPostDto,
          author,
        }),
      );
      expect(postRepository.save).toHaveBeenCalledWith(createdPost);
    });

    it('should throw NotFoundException if author not found', async () => {
      const createPostDto = {
        title: 'Test',
        content: 'Test content',
        authorId: '1',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(createPostDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [new PostEntity(), new PostEntity()];

      jest.spyOn(postRepository, 'find').mockResolvedValue(posts);

      const result = await service.findAll();

      expect(result).toBe(posts);
    });
  });

  describe('findOneById', () => {
    it('should return a post if found', async () => {
      const post = new PostEntity();

      jest.spyOn(postRepository, 'findOneBy').mockResolvedValue(post);

      const result = await service.findOneById('1');

      expect(result).toBe(post);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOneById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post and return it', async () => {
      const post = new PostEntity();
      const updatePostDto = { content: 'Updated content' };

      jest.spyOn(service, 'findOneById').mockResolvedValue(post);
      jest.spyOn(postRepository, 'save').mockResolvedValue(post);

      const result = await service.update('1', updatePostDto);

      expect(result).toBe(post);
      expect(postRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...post,
          ...updatePostDto,
        }),
      );
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.update('1', { content: 'Updated content' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if author not found', async () => {
      const post = new PostEntity();
      const updatePostDto = { title: 'Updated title', authorId: '2' };

      jest.spyOn(service, 'findOneById').mockResolvedValue(post);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update('1', updatePostDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a post if found', async () => {
      const post = new PostEntity();

      jest.spyOn(service, 'findOneById').mockResolvedValue(post);
      jest.spyOn(postRepository, 'remove').mockResolvedValue(post);

      await service.remove('1');

      expect(service.findOneById).toHaveBeenCalledWith('1');
      expect(postRepository.remove).toHaveBeenCalledWith(post);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
