import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { NotFoundException } from '@nestjs/common';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        content: 'Test content',
        authorId: '1',
      };
      const createdPost = new Post();
      jest.spyOn(service, 'create').mockResolvedValue(createdPost);

      const result = await controller.create(createPostDto);

      expect(result).toBe(createdPost);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [new Post(), new Post()];
      jest.spyOn(service, 'findAll').mockResolvedValue(posts);

      const result = await controller.findAll();

      expect(result).toBe(posts);
    });
  });

  describe('findOneById', () => {
    it('should return a post if found', async () => {
      const post = new Post();
      jest.spyOn(service, 'findOneById').mockResolvedValue(post);

      const result = await controller.findOneById('1');

      expect(result).toBe(post);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);

      await expect(controller.findOneById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a post and return it', async () => {
      const updatePostDto: UpdatePostDto = { content: 'Updated contentw' };
      const updatedPost = new Post();
      jest.spyOn(service, 'update').mockResolvedValue(updatedPost);

      const result = await controller.update('1', updatePostDto);

      expect(result).toBe(updatedPost);
      expect(service.update).toHaveBeenCalledWith('1', updatePostDto);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const removeSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValue(undefined);

      await controller.remove('1');

      expect(removeSpy).toHaveBeenCalledWith('1');
    });
  });
});
