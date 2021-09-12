import * as React from "react";
import axios from "axios";
import {
  Text,
  Button,
  Center,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";

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
  }, [id]);

  if (!game) {
    return (
      <Center height="100vh">
        <Button isLoading={true} variant="outline" />
      </Center>
    );
  }

  console.log(game);

  return (
    <Grid height="100vh" margin="5vw" templateColumns="200px auto" gap="40px">
      <GridItem>
        <Image
          fallbackSrc="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.rossendaleplayers.org.uk%2FPublic%2Fimages%2Fimagenotfound.jpg&f=1&nofb=1"
          src={game.coverUrl}
          boxSize="200px"
        />
      </GridItem>
      <GridItem>
        <Text paddingTop="30px" float="left">{game?.name}</Text>
      </GridItem>
    </Grid>
  );
};
