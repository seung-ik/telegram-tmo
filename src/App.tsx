import Telegram from "@twa-dev/sdk";
import { initSwipeBehavior } from "@telegram-apps/sdk";

import { useNavigate } from "react-router-dom";
import Router, { Paths } from "./Router";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [swipeBehavior] = initSwipeBehavior();

  // console.log(Telegram?.initDataUnsafe?.user, "user");

  useEffect(() => {
    if (Telegram) {
      Telegram.expand();
      swipeBehavior.disableVerticalSwipe();
    }
  }, [Telegram]);

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
        <div onClick={() => navigate(Paths.Game)}>수박게임</div>
        <div onClick={() => navigate(Paths.SlotGame)}>슬롯머신</div>
        <div onClick={() => navigate(Paths.JumpIframe)}>점프투점프</div>
        <div onClick={() => navigate(Paths.PlusIframe)}>더하기</div>
      </div>
      <Router />
    </div>
  );
}

export default App;
