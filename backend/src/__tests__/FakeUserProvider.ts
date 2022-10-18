import { User } from "../User";
import { UserProvider } from "../UserProvider";

export class FakeUserProvider implements UserProvider {
  private users: Map<string, User>;
  constructor() {
    this.users = new Map();
  }

  createNewUser(user: User): Promise<void> {
    this.users.set(user.id(), user);
    return Promise.resolve();
  }

  getById(userId: string): Promise<User | null> {
    return Promise.resolve(this.users.get(userId) || null);
  }

  async getByEmailOrUsername(email: string, username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email() === email || user.username() === username) {
        return user;
      }
    }

    return null;
  }
}
