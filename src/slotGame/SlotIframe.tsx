// import classNames from "classnames";
// import styles from "./index.module.scss";
import { useEffect, useRef } from "react";
import { getTickets } from ".";

// const cx = classNames.bind(styles);

const useTickets = () => {
  const prevTickets = getTickets();
  if (prevTickets) {
    localStorage.setItem("ticket_num", String(prevTickets - 1));
  }
};

export const addTickets = (_num: number) => {
  const prevTickets = getTickets();
  if (prevTickets) {
    localStorage.setItem("ticket_num", String(prevTickets + _num));
  }

  if (!prevTickets) {
    localStorage.setItem("ticket_num", String(1));
  }
};

export const getSlotGameScore = () => {
  if (!localStorage.getItem("slotGame")) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("slotGame") as string);
  }
};

const SlotIframe: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const saveSlotGameScore = (_score: number) => {
    const result = getSlotGameScore();
    result.push(_score);

    localStorage.setItem("slotGame", JSON.stringify(result));
  };

  useEffect(() => {
    // 부모 창에서 사용할 함수들을 window 객체에 추가
    window.__ctlArcadeStartSession = () => {
      console.log("Game session started!");
      // 여기에 게임 세션을 시작하는 로직을 추가하세요
    };

    window.__ctlArcadeEndSession = () => {
      console.log("Game session ended!");
      // 여기에 게임 세션을 종료하는 로직을 추가하세요
    };

    window.__ctlArcadeSaveScore = (data) => {
      console.log("Score saved:", data.score);
      saveSlotGameScore(data.score);
      // 여기에 점수를 저장하는 로직을 추가하세요
    };

    window.__ctlArcadeUseTicket = () => {
      useTickets();
    };

    window.__ctlArcadeShowInterlevelAD = () => {
      console.log("Showing interlevel ad...");
      // 여기에 광고를 표시하는 로직을 추가하세요
    };

    window.__ctlArcadeShareEvent = (data) => {
      console.log("Sharing event:", data);
      // 여기에 공유 이벤트를 처리하는 로직을 추가하세요
    };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    const myValue = { type: "SLOT_GAME", data: { tickets: getTickets() } };

    if (iframe && iframe.contentWindow) {
      iframe.onload = () => {
        iframe.contentWindow!.postMessage(myValue, "*");
      };
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "calc(100% - 20px)" }}>
      <iframe
        ref={iframeRef}
        src="/telegram-tmo/slot/index.html"
        title="HTML5 Game"
        style={{ border: "none", width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
};

export default SlotIframe;
