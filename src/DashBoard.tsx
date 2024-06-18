import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { useTonConnect } from "./hooks/useTonConnect";
import { useCounterContract } from "./hooks/useCounterContract";
import styles from "./dashboard.module.scss";
import classNames from "classnames";

const cx = classNames.bind(styles);

const DashBoard = () => {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();
  const wallet = useTonWallet();

  console.log(wallet, "연결된집갑");

  return (
    <div>
      <div className={cx("Container")}>
        <TonConnectButton />

        <div className="Card">
          <b>Counter Address</b>
          <div className="Hint">{address?.slice(0, 30) + "..."}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{value ?? "Loading..."}</div>
        </div>

        <a
          className={`Button ${connected ? "Active" : "Disabled"}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
};

export default DashBoard;