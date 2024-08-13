import { User } from "./user.model";

export interface AuthResponse {
    message: string;
    user: User
}