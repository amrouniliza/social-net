import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from 'src/users/users.module';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('/users (GET)', () => {
    it('should return a list of users', async () => {
      const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/);

      expect(response.body).toBeInstanceOf(Array);
  });
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'john',
      email: 'john.doe@example.com',
      password: 'password',
    };

      const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('id');
  });

    it('should return an error for invalid data', async () => {
      const createUserDto: CreateUserDto = {
        username: '',
        email: 'invalid-email',
        password: ''
      };
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by ID', async () => {
    const id = 1;
      const response = await request(app.getHttpServer())
        .get(`/users/${id}`)
      .expect(200)
      .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('id');
    });
    it('should return a 404 for unknown user ID', async () => {
      const id = 999;

      await request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(404);
  });
});

  describe('/users/:id (PATCH)', () => {
    it('should update an existing user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        username: 'jane',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send(updateUserDto)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('username', updateUserDto.username);
    });

    it('should return a 404 for unknown user ID', async () => {
      const id = 999;
      const updateUserDto: UpdateUserDto = {};

      await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send(updateUserDto)
        .expect(404);
  });
});

  describe('/users/:id (DELETE)', () => {
    it('should delete an existing user', async () => {
      const id = 1;

      await request(app.getHttpServer())
        .delete(`/users/${id}`)
        .expect(204);

      // Make sure the user is deleted
      await request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(404);
    });

    it('should return a 404 for unknown user ID', async () => {
      const id = 999;

      await request(app.getHttpServer())
        .delete(`/users/${id}`)
        .expect(204);

      // Make sure the user is deleted
      await request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(404);
    });
  });
});