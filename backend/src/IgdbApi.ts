import axios, { AxiosInstance } from "axios";
import { Game } from "./Game";
import { v4 as uuidv4 } from "uuid";

type IgdbApiCredentials = {
  client_id: string;
  client_secret: string;
};

type AuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type GamesResponse = {
  id: number;
  cover: {
    url: string;
  };
  name: string;
  summary: string;
};

export class IgdbApiClient {
  private credentials: IgdbApiCredentials;
  private accessToken: string;
  private accessTokenExpiration: Date;
  private axios: AxiosInstance;

  private baseUrl = "https://api.igdb.com/v4";

  // default constructor gets credentials from env
  public constructor() {
    const igdbClientId = process.env.IGDB_CLIENT_ID;
    const igdbClientSecret = process.env.IGDB_CLIENT_SECRET;

    if (typeof igdbClientId === "undefined") {
      throw new Error("igdbClientId missing in env file");
    }
    if (typeof igdbClientSecret === "undefined") {
      throw new Error("igdbClientSecret missing in env file");
    }

    this.credentials = {
      client_id: igdbClientId,
      client_secret: igdbClientSecret,
    };
    this.accessTokenExpiration = new Date("01/01/1970");
    this.axios = axios.create({});
  }

  private async authRefresh() {
    if (this.accessTokenExpiration.getTime() > Date.now()) {
      return;
    }

    const response = await axios.post<AuthResponse>(
      `https://id.twitch.tv/oauth2/token?client_id=${this.credentials.client_id}&client_secret=${this.credentials.client_secret}&grant_type=client_credentials`
    );
    this.accessTokenExpiration = new Date(Date.now() + response.data.expires_in * 1000);
    this.accessToken = response.data.access_token;
  }

  public async getGames(qty = 500, offset = 0): Promise<Game[]> {
    await this.authRefresh();
    const response = await this.axios.post<GamesResponse[]>(
      `${this.baseUrl}/games`,
      `fields name, id, cover.url, summary; limit ${qty}; offset ${offset}; sort rating desc; where rating_count > 50;`,
      {
        headers: {
          "Client-ID": this.credentials.client_id,
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    return response.data.map(
      (game) => new Game(uuidv4(), game.name, game.cover ? `https:${game.cover.url}` : null, game.summary || null)
    );
  }
}
