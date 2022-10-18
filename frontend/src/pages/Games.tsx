import * as React from "react";
import { Flex } from "@chakra-ui/react";
import { Game } from "../components/Game";
import axios from "axios";

type GameItem = { id: string; name: string; coverUrl: string };
type GameResponse = { games: GameItem[] };

const fetchGames = async () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const response = await axios.get<GameResponse>(`${apiUrl}/games`);
  return response.data.games;
};

export const Games = () => {
  const [games, setGames] = React.useState<GameItem[]>([]);
  React.useEffect(() => {
    (async () => {
      setGames(await fetchGames());
    })();
  }, []);

  return (
    <Flex
      display="flex"
      flexFlow="row wrap"
      placeContent="flex-start"
      listStyleType="none"
      margin="40px"
    >
      {games.map((game) => (
        <Game key={game.id} {...game} />
      ))}
    </Flex>
  );
};
