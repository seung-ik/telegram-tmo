import { Route, Routes as ReactRoutes } from "react-router-dom";
import Game from "./game";
import DashBoard from "./DashBoard";
import HexGame from "./hexGame";

export enum Paths {
  Dashboard = "/",
  Game = "/game",
  HexGame = "/hexgl",
}

const Router = () => {
  return (
    <ReactRoutes>
      <Route>
        <Route path={Paths.Dashboard} element={<DashBoard />} />
        <Route path={Paths.Game} element={<Game />} />
        <Route path={Paths.HexGame} element={<HexGame />} />
      </Route>
    </ReactRoutes>
  );
};

export default Router;
