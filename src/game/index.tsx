import React, { useEffect, useState } from "react";
import { Fruit, getRandomFruitFeature } from "../object/Fruit";
import styles from "./index.module.scss";
import Intro from "../intro";
import useMatterJS from "../hooks/useMatterJS";
import classNames from "classnames";
import Header from "./header";
import GameOverModal from "./gameOverModal";
import { addTickets } from "../slotGame/SlotIframe";
import { useLocation, useNavigate } from "react-router-dom";
import { Paths } from "../Router";

const cx = classNames.bind(styles);

const Game: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [bestScore, setBestScore] = useState(0);
  const [score, setScore] = useState(0);
  const [nextItem, setNextItem] = useState<Fruit>(
    getRandomFruitFeature()?.label as Fruit
  );
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const { clear } = useMatterJS({
    score,
    setScore,
    nextItem,
    setNextItem,
    isGameOver,
    setIsGameOver,
  });

  useEffect(() => {
    const bestScore = localStorage.getItem("bestScore");
    if (bestScore) setBestScore(Number(bestScore));
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver) {
      const bestScore = localStorage.getItem("bestScore") || 0;
      if (score > Number(bestScore)) {
        localStorage.setItem("bestScore", score.toString());
      }
    }
  }, [isGameOver]);

  const handleTryAgain = () => {
    setScore(0);
    setNextItem(getRandomFruitFeature()?.label as Fruit);
    setIsGameOver(false);
    clear();
  };

  const handleGetTicket = () => {
    setScore(0);
    setNextItem(getRandomFruitFeature()?.label as Fruit);
    setIsGameOver(false);
    clear();
    addTickets(1);
    navigate(Paths.SlotGame);
  };

  const handleGameStart = () => {
    setIsStart(true);
  };

  useEffect(() => {
    return () => {
      setScore(0);
      setNextItem(getRandomFruitFeature()?.label as Fruit);
      setIsGameOver(false);
      clear();
    };
  }, [location]);

  return (
    <div className={cx("gameArea")}>
      <div
        className={cx("gameWrap")}
        style={{
          visibility: isStart ? "visible" : "hidden",
        }}
      >
        <div
          className={cx("canvasArea")}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "#a0633b",
            background: "linear-gradient(0deg, #f5f1c4, #cfa76f, #a0633b)",
          }}
        >
          <Header bestScore={bestScore} score={score} nextItem={nextItem} />
          <div id={"canvasWrap"} className={cx("canvasWrap")} />
        </div>
      </div>

      <Intro isVisible={!isStart} handleGameStart={handleGameStart} />
      <GameOverModal
        isVisible={isGameOver}
        onClick={handleTryAgain}
        onClickGetTicket={handleGetTicket}
        score={score}
      />
    </div>
  );
};

export default Game;
