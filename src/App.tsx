import Telegram from "@twa-dev/sdk";

import { useNavigate } from "react-router-dom";
import Router from "./Router";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  // console.log(Telegram?.initDataUnsafe?.user, "user");

  useEffect(() => {
    // 부모 창에서 사용할 함수들을 window 객체에 추가
    window.addEventListener("message", (event) => {
      if (event.data.type === "REDIRECT") {
        navigate(event.data.url);
      }
    });
  }, []);

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
