import * as React from "react";
import axios from "axios";
import {
  Text,
  Button,
  Center,
  Image,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  Box,
} from "@chakra-ui/react";
import UniversalCookie from "universal-cookie";

type GameResponse = {
  id: string;
  name: string;
  coverUrl: string;
  summary: string;
  watchingStatus: string | null;
};

const mapWatchingStatusToFriendlyString = (
  status: string | null
): string | null => {
  switch (status) {
    case "PLANNING":
      return "Planejando";
    case "PLAYING":
      return "Jogando";
    case "COMPLETED":
      return "Completo";
    default:
      return null;
  }
};

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
const fetchGame = async (id: string) => {
  const cookies = new UniversalCookie();
  const response = await axios.get<GameResponse>(`${apiUrl}/game/${id}`, {
    headers: {
        Authorization: cookies.get("sessionToken")
          ? `Basic ${cookies.get("sessionToken")}`
          : null,
    },
  });
  return response.data;
};

const isLoggedIn = () => {
  const cookies = new UniversalCookie();
  return !!cookies.get("sessionToken");
};

const updateStatus = async (status: string, id: string) => {
  const cookies = new UniversalCookie();
  await axios.put(
    `${apiUrl}/game-list/${id}`,
    { status },
    {
      headers: {
        Authorization: `Basic ${cookies.get("sessionToken")}`,
      },
    }
  );
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

  const handleStatusUpdate = (status: string) => {
    updateStatus(status, id);
    setGame({
      ...game,
      watchingStatus: status,
    });
  };

  return (
    <Grid margin="5vw" templateColumns="200px auto" gap="40px">
      <GridItem>
        <Image
          fallbackSrc="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.rossendaleplayers.org.uk%2FPublic%2Fimages%2Fimagenotfound.jpg&f=1&nofb=1"
          src={game.coverUrl}
          boxSize="200px"
        />
        <Box visibility={isLoggedIn() ? "visible" : "hidden"} paddingTop="15px">
          <Menu>
            <MenuButton as={Button}>
              {mapWatchingStatusToFriendlyString(game.watchingStatus) ||
                "Adicionar"}
            </MenuButton>
            <MenuList>
              <MenuItemOption onClick={() => handleStatusUpdate("PLANNING")}>
                Planejando
              </MenuItemOption>
              <MenuItemOption onClick={() => handleStatusUpdate("PLAYING")}>
                Jogando
              </MenuItemOption>
              <MenuItemOption onClick={() => handleStatusUpdate("COMPLETED")}>
                Completo
              </MenuItemOption>
            </MenuList>
          </Menu>
        </Box>
      </GridItem>
      <GridItem display="inline-grid">
        <Heading textAlign="left" paddingTop="30px" float="left">
          {game.name}
        </Heading>
        <Text textAlign="left">{game.summary}</Text>
      </GridItem>
    </Grid>
  );
};
