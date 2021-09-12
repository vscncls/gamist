import { User } from "./User";
import { UserDTO } from "./UserDTO";
import { UserProvider } from "./UserProvider";

export class EmailAlreadyExists extends Error {
  constructor() {
    super("Email already exists");
  }
}
export class UsernameAlreadyExists extends Error {
  constructor() {
    super("Username already exists");
  }
}

export class RegisterUserCommand {
  private userProvider: UserProvider;

  public constructor(userProvider: UserProvider) {
    this.userProvider = userProvider;
  }

  public async execute(userDTO: UserDTO): Promise<void> {
    const user = await User.ofPlainTextPassword(userDTO.id, userDTO.email, userDTO.username, userDTO.password);
    const existentUser = await this.userProvider.getByEmailOrUsername(userDTO.email, userDTO.username);
    if (existentUser) {
      if (userDTO.username === existentUser.username()) {
        throw new UsernameAlreadyExists();
      }
      if (userDTO.email === existentUser.email()) {
        throw new EmailAlreadyExists();
      }
    }

    await this.userProvider.createNewUser(user);
  }
}
