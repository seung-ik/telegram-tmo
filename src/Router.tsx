import { Route, Routes as ReactRoutes, useLocation } from "react-router-dom";
import Game from "./Game";
import DashBoard from "./DashBoard";

export enum Paths {
  Dashboard = "/",
  Game = "/game",
}

const Router = () => {
  return (
    <ReactRoutes>
      <Route>
        <Route path={Paths.Dashboard} element={<DashBoard />} />
        <Route path={Paths.Game} element={<Game />} />
      </Route>
    </ReactRoutes>
  );
};

export default Router;
