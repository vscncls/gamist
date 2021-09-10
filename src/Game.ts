export class Game {
  private name_: string;
  private coverUrl_: string | null;

  constructor(name: string, coverUrl: string | null) {
    this.name_ = name;
    this.coverUrl_ = coverUrl;
  }

  public name(): string {
    return this.name_;
  }

  public coverUrl(): string | null {
    return this.coverUrl_;
  }
}
