import { User } from "./User";

export interface UserProvider {
  getByEmailOrUsername(email: string | null, username: string | null): Promise<User | null>;
  createNewUser(user: User): Promise<void>;
  getById(userId: string): Promise<User | null>;
}
