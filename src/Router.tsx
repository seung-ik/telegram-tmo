import { Route, Routes as ReactRoutes } from "react-router-dom";
import Game from "./game";
import DashBoard from "./DashBoard";
import HexGame from "./hexGame";
import SlotGame from "./slotGame";
import SlotIframe from "./slotGame/SlotIframe";

export enum Paths {
  Dashboard = "/",
  Game = "/game",
  HexGame = "/hexgl",
  SlotGame = "/slot",
  SlotIframe = "/slot/start",
}

const Router = () => {
  return (
    <ReactRoutes>
      <Route>
        <Route path={Paths.Dashboard} element={<DashBoard />} />
        <Route path={Paths.Game} element={<Game />} />
        <Route path={Paths.HexGame} element={<HexGame />} />
        <Route path={Paths.SlotGame} element={<SlotGame />} />
        <Route path={Paths.SlotIframe} element={<SlotIframe />} />
      </Route>
    </ReactRoutes>
  );
};

export default Router;
