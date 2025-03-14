import Telegram from "@twa-dev/sdk";

import { useNavigate } from "react-router-dom";
import Router, { Paths } from "./Router";
import { useEffect } from "react";
// import { request } from "@telegram-apps/sdk";
// import { initSwipeBehavior } from "@telegram-apps/sdk";
// import { request } from "@telegram-apps/sdk";
// import { mockTelegramEnv, parseInitData } from "@telegram-apps/sdk";

// const initDataRaw = new URLSearchParams([
//   [
//     "user",
//     JSON.stringify({
//       id: 99281932,
//       first_name: "Andrew",
//       last_name: "Rogue",
//       username: "rogue",
//       language_code: "en",
//       is_premium: true,
//       allows_write_to_pm: true,
//     }),
//   ],
//   ["hash", "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31"],
//   ["auth_date", "1716922846"],
//   ["start_param", "debug"],
//   ["chat_type", "sender"],
//   ["chat_instance", "8428209589180549439"],
// ]).toString();
// mockTelegramEnv({
//   themeParams: {
//     accentTextColor: "#6ab2f2",
//     bgColor: "#17212b",
//     buttonColor: "#5288c1",
//     buttonTextColor: "#ffffff",
//     destructiveTextColor: "#ec3942",
//     headerBgColor: "#17212b",
//     hintColor: "#708499",
//     linkColor: "#6ab3f3",
//     secondaryBgColor: "#232e3c",
//     sectionBgColor: "#17212b",
//     sectionHeaderTextColor: "#6ab3f3",
//     subtitleTextColor: "#708499",
//     textColor: "#f5f5f5",
//   },
//   initData: parseInitData(initDataRaw),
//   initDataRaw,
//   version: "7.7",
//   platform: "tdesktop",
// });

function App() {
  const navigate = useNavigate();

  // const [swipeBehavior] = initSwipeBehavior();

  // useEffect(() => {
  //   swipeBehavior.disableVerticalSwipe();
  //   console.log(swipeBehavior.isVerticalSwipeEnabled); // false
  // }, []);

  const handleClose = () => {
    const isTelegramApp =
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initData;

    if (isTelegramApp) {
      window.Telegram.WebApp.close();
    } else {
      alert("You can visit through the Telegram app.");
      window.close();
    }
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready();
      tg.sendData("web_app_setup_swipe_behavior", false, {
        allow_vertical_swipe: false,
      });
      if (tg.enableVerticalSwipes) {
        alert(`enableVerticalSwipes ${tg.enableVerticalSwipes}`);
      }
      if (tg.disableVerticalSwipes) {
        alert(`disableVerticalSwipes ${tg.disableVerticalSwipes}`);
      }
      if (tg.isVerticalSwipesEnabled) {
        alert(`isVerticalSwipesEnabled ${tg.isVerticalSwipesEnabled}`);
      }
    }

    // const test = async () => {
    //   const value = await request({
    //     method: "web_app_request_viewport",
    //     event: "viewport_changed",
    //   });

    //   alert(JSON.stringify(value));
    // };
    // test();
  }, [window.Telegram]);

  useEffect(() => {
    // Telegram Web Apps SDK 로드 확인
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();

      // 뒤로 가기 버튼 또는 닫기 버튼 활성화
      if (location.pathname === "/telegram-tmo/") {
        // 첫 페이지인 경우 닫기 버튼 활성화
        tg.BackButton.hide();

        // 닫기 버튼 클릭 이벤트 처리
        tg.MainButton.onClick(() => {
          tg.close(); // Telegram Mini App 닫기
        });
      } else {
        // 첫 페이지가 아닌 경우 뒤로 가기 버튼 활성화
        tg.BackButton.show();

        // 뒤로 가기 버튼 클릭 이벤트 처리
        tg.BackButton.onClick(() => {
          navigate(-1); // 뒤로 가기
        });
      }

      // 컴포넌트 언마운트 시 이벤트 핸들러 제거
      return () => {
        tg.BackButton.offClick();
      };
    }
  }, [navigate, location.pathname]);

  // useEffect(() => {
  //   if (Telegram) {
  //     console.log(Telegram, "?????????????????");
  //     // window.Telegram.WebView?.postEvent(
  //     //   "web_app_setup_swipe_behavior",
  //     //   (data: any) => console.log(data),
  //     //   data2
  //     // );
  //     // Telegram.expand();
  //   }
  // }, [Telegram]);

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
        <div onClick={() => navigate(Paths.Apple)}>사과게임</div>
        <div
          onClick={() => {
            const tg = window.Telegram.WebApp;
            // tg.openLink("https://t.me/ikek_bot?start=invite");
            const url = `https://t.me/dev_ik_game_bot/start?startapp=${Telegram?.initDataUnsafe?.user?.id}`;
            const text = encodeURIComponent(
              `초대하면 100원 줌! \n⭐️ 초대하고 게임 시작하면 500원 줌`
            );
            tg.openTelegramLink(
              `https://t.me/share/url?url=${url}&text=${text}
             `
            );

            // tg.showPopup({
            //   title: "친구 초대",
            //   message: "어떤 대화방에 초대 메시지를 보낼까요?",
            //   buttons: [
            //     { id: "cancel", type: "close", text: "취소" },
            //     { id: "send", type: "default", text: "보내기" },
            //   ],
            // });
          }}
        >
          친구초대해보기
        </div>
      </div>
      <button onClick={handleClose}> 닫기 테스트</button>

      <Router />
    </div>
  );
}

export default App;
