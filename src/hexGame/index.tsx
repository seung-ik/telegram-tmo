import classNames from "classnames";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

const HexGame: React.FC = () => {
  const [gameResult, setGameResult] = useState(null);

  console.log(gameResult, "inreact");

  useEffect(() => {
    const handleMessage = (event: { origin: string; data: any }) => {
      if (event.origin !== window.location.origin) return;
      console.log("Message received from game:", event.data);
      const result = event.data;
      if (result.type === "gameOver") {
        console.log("Game over result:", result);
        setGameResult(result);
        alert(result.score + " in react ");
        return window.location.reload();
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
        src="/telegram-tmo/hexgl/index.html"
        title="HTML5 Game"
        style={{ border: "none", width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
};

export default HexGame;
