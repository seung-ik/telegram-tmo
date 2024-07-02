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

  console.log(myCards);
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
        {myCards.length > 0 &&
          myCards.map((el: any) => (
            <div>
              {el}
              <img src={CardImg[`CARD_${el}` as CardKey]} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SlotGame;
