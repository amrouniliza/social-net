import { FormControl } from '@angular/forms';
import { User } from './user.model';

export type CreateUserDto = Omit<
  User,
  'id' | 'avatarUrl' | 'backgroundUrl' | 'bio'
>;

export type CreateUserDtoForm = {
  [field in keyof CreateUserDto]: FormControl<CreateUserDto[field] | null>;
};
