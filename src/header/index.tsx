import { FruitImg } from "../assets";
import { Fruit } from "../object/Fruit";
import { getRenderWidth } from "../object/Size";
import styles from "./index.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface HeaderProps {
  bestScore: number;
  score: number;
  nextItem: null | Fruit;
}

const Header = ({ score, bestScore, nextItem }: HeaderProps) => {
  const getBestScore = () => {
    return score > bestScore ? score : bestScore;
  };
  console.log(nextItem);

  return (
    <div
      className={cx("headerArea")}
      style={{ maxWidth: getRenderWidth() + 4 }}
    >
      <div className={cx("bestScoreArea")}>
        <span className={cx("text")}>BEST</span>
        <span className={cx("number")}>{getBestScore()}</span>
      </div>
      <div className={cx("scoreArea")}>
        <span className={cx("score")}>{score}</span>
      </div>
      <div className={cx("nextArea")}>
        <span className={cx("text")}>NEXT</span>
        <div className={cx("next")}>
          <span
            className={cx("img")}
            style={{
              backgroundImage: `url(${FruitImg[nextItem as Fruit]})`,
            }}
          />
          <span className={cx("img")} />
        </div>
      </div>
    </div>
  );
};

export default Header;
