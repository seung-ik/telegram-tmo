import "./App.css";
import "@twa-dev/sdk";
import Telegram from "@twa-dev/sdk";

import { useNavigate } from "react-router-dom";
import Router from "./Router";

function App() {
  const navigate = useNavigate();

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
        <div>{Telegram?.initDataUnsafe?.user?.id || "id"}</div>
        <div>{Telegram?.initDataUnsafe?.user?.username || "username"}</div>
        <div>{Telegram?.initDataUnsafe?.user?.first_name || "firstname"}</div>
        <div onClick={() => navigate("/")}>튜터리얼</div>
        <div onClick={() => navigate("/game")}>게임</div>
      </div>
      <Router />
    </div>
  );
}

export default App;
