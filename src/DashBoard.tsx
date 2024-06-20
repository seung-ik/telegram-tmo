import {
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useTonConnect } from "./hooks/useTonConnect";
import { useCounterContract } from "./hooks/useCounterContract";
import styles from "./dashboard.module.scss";
import classNames from "classnames";
import { toNano } from "@ton/core";
import { beginCell } from "@ton/ton";
import { useState } from "react";

const cx = classNames.bind(styles);

const DashBoard = () => {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();
  const wallet = useTonWallet();
  const [recieveAddress, setRecieveAddress] = useState("");
  const [tonConnectUI] = useTonConnectUI();

  const body = beginCell()
    .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
    .storeStringTail("전송테스트") // write our text comment
    .endCell();

  console.log(wallet, "연결된집갑");

  const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: recieveAddress, // destination address
        amount: toNano(0.05).toString(), //Toncoin in nanotons
        payload: body.toBoc().toString("base64"), // payload with comment in body
      },
    ],
  };

  return (
    <div>
      <div className={cx("Container")}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "80px",
          }}
        >
          <TonConnectButton />
        </div>

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
        <div>
          {connected && (
            <>
              <span>받는주소</span>
              <input
                type="text"
                value={recieveAddress}
                onChange={(e) => setRecieveAddress(e.target.value)}
              />
              <button
                style={{
                  border: "2px solid green",
                  padding: "10px",
                  cursor: "pointer",
                  background: "gray",
                  color: "white",
                }}
                onClick={() => {
                  if (!recieveAddress) return;
                  tonConnectUI.sendTransaction(myTransaction);
                }}
              >
                0.05ton 전송 버튼
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
