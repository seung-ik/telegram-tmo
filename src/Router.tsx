import { Route, Routes as ReactRoutes, useNavigate } from "react-router-dom";
import Game from "./game";
import DashBoard from "./DashBoard";
import HexGame from "./hexGame";
import SlotGame from "./slotGame";
import SlotIframe from "./slotGame/SlotIframe";
import { useEffect } from "react";
import TaptenIframe from "./jump/JumpIframe";
import PlusIframe from "./plus/PlusIframe";
import AppleGame from "./game/appleGame/AppleGame";

export enum Paths {
  Dashboard = "/",
  Game = "/game",
  HexGame = "/hexgl",
  SlotGame = "/slot",
  SlotIframe = "/slot/start",
  JumpIframe = "/jump",
  PlusIframe = "/plus",
  Apple = "/apple",
}

const Router = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 부모 창에서 사용할 함수들을 window 객체에 추가
    window.addEventListener("message", (event) => {
      if (event.data.type === "REDIRECT") {
        navigate(event.data.url);
      }
    });
  }, []);

  return (
    <ReactRoutes>
      <Route>
        <Route path={Paths.Dashboard} element={<DashBoard />} />
        <Route path={Paths.Game} element={<Game />} />
        <Route path={Paths.HexGame} element={<HexGame />} />
        <Route path={Paths.SlotGame} element={<SlotGame />} />
        <Route path={Paths.SlotIframe} element={<SlotIframe />} />
        <Route path={Paths.JumpIframe} element={<TaptenIframe />} />
        <Route path={Paths.Apple} element={<AppleGame />} />
        <Route path={Paths.PlusIframe} element={<PlusIframe />} />
      </Route>
    </ReactRoutes>
  );
};

export default Router;
