import { User } from 'src/users/interfaces';

export interface ValidatedUser extends Pick<User, 'id' | 'email'> {}
