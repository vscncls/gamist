import { version as uuidVersion, validate as uuidValidate } from "uuid";
import { GetUserSessionTokenQuery, PasswordDoesntMatch, UserNotFound } from "../GetUserSessionTokenQuery";
import { SessionToken } from "../SessionToken";
import { SessionTokenProvider } from "../SessionTokenProvider";
import { User } from "../User";
import { FakeUserProvider } from "./FakeUserProvider";

function uuidValidateV4(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

class FakeSessionTokenProvider implements SessionTokenProvider {
  private tokens: Map<string, SessionToken>;
  constructor() {
    this.tokens = new Map();
  }

  insertToken(token: SessionToken) {
    this.tokens.set(token.asString(), token);
    return Promise.resolve();
  }

  fetchTokenByValue(tokenValue: string) {
    return Promise.resolve(this.tokens.get(tokenValue) || null);
  }
}

describe("Get user session token", () => {
  it("works on a valid credentials", async () => {
    const userProvider = new FakeUserProvider();
    const getUserSessionTokenQuery = new GetUserSessionTokenQuery(userProvider, new FakeSessionTokenProvider());
    const user = await User.ofPlainTextPassword(
      "bba9cde3-0bad-4e59-b7ff-58b1676c92ee",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha123"
    );
    await userProvider.createNewUser(user);

    const sessionToken = await getUserSessionTokenQuery.execute({ email: "lucas@vscncls.xyz", password: "senha123" });

    expect(sessionToken.userId()).toBe(user.id());
    expect(uuidValidateV4(sessionToken.asString())).toBeTruthy();
  });

  it("throws when user doesnt exist", async () => {
    const userProvider = new FakeUserProvider();
    const getUserSessionTokenQuery = new GetUserSessionTokenQuery(userProvider, new FakeSessionTokenProvider());

    await expect(
      async () => await getUserSessionTokenQuery.execute({ email: "lucas@vscncls.xyz", password: "senha123" })
    ).rejects.toThrow(UserNotFound);
  });

  it("throws on wrong password", async () => {
    const userProvider = new FakeUserProvider();
    const getUserSessionTokenQuery = new GetUserSessionTokenQuery(userProvider, new FakeSessionTokenProvider());
    const user = await User.ofPlainTextPassword(
      "bba9cde3-0bad-4e59-b7ff-58b1676c92ee",
      "lucas@vscncls.xyz",
      "vscncls",
      "senha123"
    );
    await userProvider.createNewUser(user);

    await expect(
      async () => await getUserSessionTokenQuery.execute({ email: "lucas@vscncls.xyz", password: "senha errada" })
    ).rejects.toThrow(PasswordDoesntMatch);
  });
});
