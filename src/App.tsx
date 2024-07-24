import Telegram from "@twa-dev/sdk";

import { useNavigate } from "react-router-dom";
import Router, { Paths } from "./Router";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  // console.log(Telegram?.initDataUnsafe?.user, "user");

  useEffect(() => {
    const data = JSON.stringify({ is_visible: true });
    const data2 = JSON.stringify({ allow_vertical_swipe: false });

    alert("1");
    window.TelegramWebviewProxy?.postEvent("web_app_setup_back_button", data);
    window.TelegramWebviewProxy?.postEvent(
      "web_app_setup_swipe_behavior",
      data2
    );
    alert("2");

    if (Telegram) {
      Telegram.expand();
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
