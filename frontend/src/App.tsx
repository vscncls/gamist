import * as React from "react";
import { Box } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Singup as Signup } from "./pages/Singup";
import { Singin as Signin } from "./pages/Singin";
import { Games } from "./pages/Games";
import { Game } from "./pages/Game";

export const App = () => (
  <Router>
    <Box textAlign="center" fontSize="xl">
      <ColorModeSwitcher />
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/games">
          <Games />
        </Route>
        <Route path="/game/:id">
          {(props) => <Game id={props.location!.pathname.split("/")[2]} />}
        </Route>
        <Redirect from="/" to="/signup" />
      </Switch>
    </Box>
  </Router>
);
