export class Game {
  private _name: string;
  private _coverUrl: string | null;
  private _id: string;
  private _summary: string | null;

  constructor(id: string, name: string, coverUrl: string | null, summary: string | null) {
    this._id = id;
    this._name = name;
    this._coverUrl = coverUrl;
    this._summary = summary;
  }

  public name(): string {
    return this._name;
  }

  public coverUrl(): string | null {
    return this._coverUrl;
  }

  public id(): string {
    return this._id;
  }

  public summary(): string | null {
    return this._summary;
  }
}
