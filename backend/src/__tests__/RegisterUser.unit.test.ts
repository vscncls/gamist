import { EmailAlreadyExists, RegisterUserCommand, UsernameAlreadyExists } from "../RegisterUserCommand";
import { FakeUserProvider } from "./FakeUserProvider";

describe("Register user", () => {
  it("saves user", async () => {
    const userProvider = new FakeUserProvider();
    const command = new RegisterUserCommand(userProvider);

    const userId = "f8a3e94f-4e2e-4ff7-aaa0-8045814d8231";
    await command.execute({
      id: userId,
      email: "lucas@vscncls.xyz",
      username: "vscncls",
      password: "teste",
    });

    const user = await userProvider.getById(userId);
    expect(user).not.toBeNull();
    expect(user!.id()).toEqual(userId);
  });

  it("throws if email already registered", async () => {
    const userProvider = new FakeUserProvider();
    const command = new RegisterUserCommand(userProvider);

    await command.execute({
      id: "f8a3e94f-4e2e-4ff7-aaa0-8045814d8231",
      email: "lucas@vscncls.xyz",
      username: "vscncls1",
      password: "teste",
    });

    await expect(
      command.execute({
        id: "e6884def-1ee6-4581-a471-428da2afd670",
        email: "lucas@vscncls.xyz",
        username: "vscncls2",
        password: "teste",
      })
    ).rejects.toThrow(EmailAlreadyExists);
  });

  it("throws if user already registered", async () => {
    const userProvider = new FakeUserProvider();
    const command = new RegisterUserCommand(userProvider);

    await command.execute({
      id: "f8a3e94f-4e2e-4ff7-aaa0-8045814d8231",
      email: "lucas+1@vscncls.xyz",
      username: "vscncls",
      password: "teste",
    });

    await expect(
      command.execute({
        id: "e6884def-1ee6-4581-a471-428da2afd670",
        email: "lucas+2@vscncls.xyz",
        username: "vscncls",
        password: "teste",
      })
    ).rejects.toThrow(UsernameAlreadyExists);
  });
});
