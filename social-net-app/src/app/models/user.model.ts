export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
}
