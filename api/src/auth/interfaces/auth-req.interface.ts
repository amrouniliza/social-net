import { Request } from 'express';
import { User } from 'src/users/interfaces';

export interface AuthenticatedRequest extends Request {
  user: User;
}
