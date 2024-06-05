import "./App.css";
import "@twa-dev/sdk";
import { Telegram } from "@twa-dev/types";

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

import { useNavigate } from "react-router-dom";
import Router from "./Router";

function App() {
  const navigate = useNavigate();
  console.log(window.Telegram.WebApp.initDataUnsafe.user?.id, "info");

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          gap: "30px",
          justifyContent: "center",
          border: "2px solid white",
        }}
      >
        <div>{window.Telegram.WebApp.initDataUnsafe.user?.id || "id"}</div>
        <div>
          {window.Telegram.WebApp.initDataUnsafe.user?.username || "username"}
        </div>
        <div onClick={() => navigate("/")}>튜터리얼</div>
        <div onClick={() => navigate("/game")}>게임</div>
      </div>
      <Router />
    </div>
  );
}

export default App;
