import Telegram from "@twa-dev/sdk";

import { useNavigate } from "react-router-dom";
import Router from "./Router";

function App() {
  const navigate = useNavigate();
  // console.log(Telegram?.initDataUnsafe?.user, "user");

  return (
    // <Router />
    <div className="App">
      <div
        style={{
          display: "flex",
          gap: "30px",
          justifyContent: "center",
        }}
      >
        <div>{Telegram?.initDataUnsafe?.user?.id || "id"}</div>
        <div>{Telegram?.initDataUnsafe?.user?.username || "username"}</div>
        <div>{Telegram?.initDataUnsafe?.user?.first_name || "firstname"}</div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "30px",
          justifyContent: "center",
        }}
      >
        <div onClick={() => navigate("/")}>튜터리얼</div>
        <div onClick={() => navigate("/game")}>게임</div>
        <div onClick={() => navigate("/hexgl")}>비행기</div>
        <div onClick={() => navigate("/slot")}>슬롯머신</div>
      </div>
      <Router />
    </div>
  );
}

export default App;
