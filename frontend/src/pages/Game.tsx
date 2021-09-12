import * as React from "react";
import axios from "axios";
import { Text } from "@chakra-ui/react";
import { FaTruckLoading } from "react-icons/fa";

type GameResponse = { id: string; name: string; coverUrl: string };

const fetchGame = async (id: string) => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const response = await axios.get<GameResponse>(`${apiUrl}/game/${id}`);
  return response.data;
};
export const Game: React.FC<{ id: string }> = ({ id }) => {
  const [game, setGame] = React.useState<GameResponse | null>(null);
  React.useEffect(() => {
    (async () => {
      setGame(await fetchGame(id));
    })();
  }, []);

  if (!game) {
    return <FaTruckLoading />;
  }

  console.log(game);

  return <Text>{game?.name}</Text>;
};
