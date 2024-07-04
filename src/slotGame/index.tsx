// import classNames from "classnames";
// import styles from "./index.module.scss";
// import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Paths } from "../Router";
import { getSlotGameScore } from "./SlotIframe";
import { CardImg, CardKey } from "../assets";

// const cx = classNames.bind(styles);

const SlotGame: React.FC = () => {
  const navigate = useNavigate();

  const myCards = getSlotGameScore();

  // 카드 그룹화
  const cardCounts = myCards.reduce((acc: any, card: any) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <button
        style={{ border: "2px solid green", padding: "16px", fontSize: "20px" }}
        onClick={() => navigate(Paths.SlotIframe)}
      >
        start
      </button>
      <div>
        <span>내가 모은 카드 목록</span>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "36px",
          }}
        >
          {Object.keys(cardCounts).map((card: any) => (
            <div
              key={card}
              style={{
                margin: "16px",
                position: "relative",

                width: "220px",
                height: "220px",
              }}
            >
              {Array.from({ length: cardCounts[card] }).map((_, index) => (
                <img
                  key={index}
                  src={CardImg[`CARD_${card}` as CardKey]}
                  alt=""
                  style={{
                    position: "absolute",
                    border: "1px solid gray",
                    top: `${index * 12}px`, // 겹치는 간격 조정
                    left: `${index * 4}px`, // 같은 종류의 카드는 겹치게
                    zIndex: index,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotGame;
