// import classNames from "classnames";
// import styles from "./index.module.scss";

import { useEffect } from "react";
import Telegram from "@twa-dev/sdk";
import { addTickets } from "../slotGame/SlotIframe";
import { useNavigate } from "react-router-dom";
import { Paths } from "../Router";

// const cx = classNames.bind(styles);
interface QueryParams {
  [key: string]: string;
}

const PlusIframe: React.FC = () => {
  const navigate = useNavigate();
  function stringToObject(str: string): QueryParams {
    // 먼저 문자열을 & 기준으로 분리합니다.
    const keyValuePairs = str.split("&");

    // 결과를 저장할 객체 생성
    const result: QueryParams = {};

    // 각각의 키-값 쌍을 객체에 저장합니다.
    keyValuePairs.forEach((keyValue) => {
      const pair = keyValue.split("=");
      const key = pair[0];
      const value = pair[1];
      // decodeURIComponent을 사용하여 URL 인코딩된 값을 디코딩합니다.
      result[key] = decodeURIComponent(value);
    });

    return result;
  }

  useEffect(() => {
    const handleMessage = (event: { origin: string; data: any }) => {
      if (event.origin !== window.location.origin) return;

      const result = event.data;
      if (result.type === "plus_score") {
        const gameInfo = stringToObject(result.data);

        // alert(result.score + " in react ");
        // return window.location.reload();
        alert(`
        결과값 저장으로 대체 해야함
        actionid: ${gameInfo.action_id}
        score: ${gameInfo.score}
        telegramid: ${
          Telegram?.initDataUnsafe?.user?.id || "???텔레그램 미니앱 아닐때"
        }
        `);

        if (Number(gameInfo.score) >= 5) {
          addTickets(1);
          alert("티켓이 지급되었습니다");
          navigate(Paths.SlotGame);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <div style={{ width: "100%", height: "calc(100% - 20px)" }}>
      <iframe
        src="/telegram-tmo/game/plus/index.html"
        title="HTML5 Game"
        style={{ border: "none", width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
};

export default PlusIframe;
