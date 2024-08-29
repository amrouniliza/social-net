// social-net-app/src/app/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageServiceMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        AuthService,
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', [
            'saveUser',
            'removeUser',
          ]),
        },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageServiceMock = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return an observable with the authenticated user', () => {
      const user: User = { email: 'test@example.com', password: 'password' };
      const response = { user };

      httpMock.expectOne('https://example.com/api/auth/login').flush(response);

      service
        .login({ email: 'test@example.com', password: 'password' })
        .subscribe((result) => {
          expect(result).toEqual(user);
        });
    });

    it('should throw an error if the login fails', () => {
      const err: ProgressEvent = new ProgressEvent('Bad credentials');

      httpMock.expectOne('https://example.com/api/auth/login').error(err);

      service
        .login({ email: 'test@example.com', password: 'password' })
        .subscribe((result) => {
          expect(result).toBeUndefined();
        });
    });
  });

  describe('getUserProfile', () => {
    it('should return an observable with the user profile', () => {
      const user: User = { email: 'test@example.com', password: 'password' };
      const response = { user };

      httpMock.expectOne('https://example.com/api/auth/me').flush(response);

      service.getUserProfile().subscribe((result) => {
        expect(result).toEqual(user);
      });
    });
  });

  describe('register', () => {
    it('should return an observable with the registered user', () => {
      const user: User = { email: 'test@example.com', password: 'password' };
      const response = { user };

      httpMock
        .expectOne('https://example.com/api/auth/register')
        .flush(response);

      service
        .register({ email: 'test@example.com', password: 'password' })
        .subscribe((result) => {
          expect(result).toEqual(user);
        });
    });
  });

  describe('logout', () => {
    it('should remove the user from storage', () => {
      service.logout();
      expect(storageServiceMock.removeUser).toHaveBeenCalled();
    });
  });

  describe('autoLogin', () => {
    it('should retrieve the user from storage', () => {
      service.autoLogin();
      expect(storageServiceMock.getSavedUser).toHaveBeenCalled();
    });
  });
});
