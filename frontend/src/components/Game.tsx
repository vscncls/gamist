import * as React from "react";
import { Image, Text, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const Game: React.FC<{ id: string; name: string; coverUrl: string }> = ({
  name,
  coverUrl,
  id,
}) => {
  return (
    <RouterLink to={`/game/${id}`}>
      <Box marginRight="80px" marginBottom="30px" maxWidth="200px">
        <Image
          fallbackSrc="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.rossendaleplayers.org.uk%2FPublic%2Fimages%2Fimagenotfound.jpg&f=1&nofb=1"
          src={coverUrl}
          boxSize="200px"
          marginBottom="10px"
        />
        <Text>{name}</Text>
      </Box>
    </RouterLink>
  );
};
