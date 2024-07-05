// import classNames from "classnames";
// import styles from "./index.module.scss";
// import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Paths } from "../Router";
import { addTickets, getSlotGameScore } from "./SlotIframe";
import { CardImg, CardKey } from "../assets";
import { useEffect, useState } from "react";
import { format, addHours, isAfter } from "date-fns";

// const cx = classNames.bind(styles);

export function getTickets() {
  return Number(localStorage.getItem("ticket_num")) || 0;
}

const SlotGame: React.FC = () => {
  const navigate = useNavigate();
  const [myTickets, setMyTickets] = useState<number>(0);
  const FREE_TICKET_GAP_TIME = 3;

  const myCards = getSlotGameScore();

  // const myTickets = useMemo(
  //   () => getTickets(),
  //   [localStorage.getItem("ticket_num")]
  // );

  // 카드 그룹화
  const cardCounts = myCards.reduce((acc: any, card: any) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    setMyTickets(getTickets());
  }, [localStorage.getItem("ticket_num")]);

  return (
    <div>
      <button
        style={{ border: "2px solid green", padding: "16px", fontSize: "20px" }}
        onClick={() => navigate(Paths.SlotIframe)}
      >
        룰렛돌려서 카드모으기~
      </button>

      <button
        style={{ border: "2px solid green", padding: "16px", fontSize: "20px" }}
        onClick={() => {
          const latestFreeTicketTime =
            localStorage.getItem("LATEST_TICKET_TIME");

          // 현재 시간을 가져오기
          const currentTime = new Date();

          if (
            !latestFreeTicketTime ||
            isAfter(
              currentTime,
              addHours(new Date(latestFreeTicketTime), FREE_TICKET_GAP_TIME)
            )
          ) {
            localStorage.setItem("LATEST_TICKET_TIME", currentTime.toString()); // Date 객체를 문자열로 변환

            addTickets(1);
            setMyTickets((prev) => prev + 1);
          } else {
            const nextClaimTime = format(
              addHours(new Date(latestFreeTicketTime), FREE_TICKET_GAP_TIME),
              "yyyy-MM-dd HH:mm:ss"
            );
            alert(
              `아직 ${FREE_TICKET_GAP_TIME}시간이 지나지 않았습니다. ${nextClaimTime}에 티켓을 받을 수 있습니다.`
            );
          }
        }}
      >
        공짜티켓받기
      </button>
      <div>
        <div>
          <span>보유 티켓: {myTickets}</span>
        </div>
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
