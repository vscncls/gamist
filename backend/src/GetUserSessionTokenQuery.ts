import { UserProvider } from "./UserProvider";
import { SessionTokenProvider } from "./SessionTokenProvider";
import { SessionToken } from "./SessionToken";
import { GetSessionTokenDTO } from "./GetSessionTokenDTO";

export class UserNotFound extends Error {}

export class PasswordDoesntMatch extends Error {}

export class GetUserSessionTokenQuery {
  private userProvider: UserProvider;
  private sessionTokenProvider: SessionTokenProvider;

  public constructor(userProvider: UserProvider, sessionTokenProvider: SessionTokenProvider) {
    this.userProvider = userProvider;
    this.sessionTokenProvider = sessionTokenProvider;
  }

  public async execute(getSessionTokenDTO: GetSessionTokenDTO): Promise<SessionToken> {
    const user = await this.userProvider.getByEmailOrUsername(getSessionTokenDTO.email, null);
    if (!user) {
      throw new UserNotFound();
    }

    if (!(await user.passwordMatches(getSessionTokenDTO.password))) {
      throw new PasswordDoesntMatch();
    }
    const sessionToken = SessionToken.newToken(user);
    await this.sessionTokenProvider.insertToken(sessionToken);

    return sessionToken;
  }
}
