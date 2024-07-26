import Telegram from "@twa-dev/sdk";

import { useNavigate } from "react-router-dom";
import Router, { Paths } from "./Router";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Telegram Web Apps SDK 로드 확인
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      console.log(tg);
      if (tg.disableVerticalSwipes) {
        alert("disable vertical");
        tg.disableVerticalSwipes();
      }
      // 뒤로 가기 버튼 활성화
      tg.BackButton.show();

      // 뒤로 가기 버튼 클릭 이벤트 처리
      tg.BackButton.onClick(() => {
        navigate(-1); // 뒤로 가기
      });

      // 컴포넌트 언마운트 시 이벤트 핸들러 제거
      return () => {
        tg.BackButton.offClick();
      };
    }
  }, [navigate]);

  useEffect(() => {
    const data2 = JSON.stringify({ allow_vertical_swipe: false });

    if (Telegram) {
      console.log(window.Telegram.WebView.postEvent);
      window.Telegram.WebView?.postEvent(
        "web_app_setup_swipe_behavior",
        (data: any) => console.log(data),
        data2
      );
      Telegram.expand();
    }
  }, [Telegram]);

  return (
    // <Router />
    <div className="App" style={{ height: "100vh", overflow: "scroll" }}>
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
