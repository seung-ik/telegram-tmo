import {
  TonConnectButton,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useTonConnect } from "./hooks/useTonConnect";
import { useCounterContract } from "./hooks/useCounterContract";
import styles from "./dashboard.module.scss";
import classNames from "classnames";
import { Address, toNano } from "@ton/core";
import { beginCell } from "@ton/ton";
import { useState } from "react";
import { useIkekContract } from "./hooks/useIkekdContract";
import TonWeb from "tonweb";

const cx = classNames.bind(styles);

const DashBoard = () => {
  const { open, close } = useTonConnectModal();

  const { connected } = useTonConnect();
  const { jettonAddress } = useIkekContract();
  const { value, address, sendIncrement } = useCounterContract();
  const wallet = useTonWallet();
  // const tonAddress = useTonAddress();
  // console.log("tonAddress", tonAddress);
  const [recieveAddress, setRecieveAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tonConnectUI] = useTonConnectUI();

  // console.log(wallet, "연결된집갑");

  const onClickTonTx = () => {
    if (!amount) {
      alert("수량입력하세요");
      return;
    }
    if (!wallet?.account.address) {
      alert("지갑연결하세요");
      return;
    }
    if (!recieveAddress) {
      alert("받는주소 입력하세요");
      return;
    }

    const body = beginCell()
      .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
      .storeStringTail("전송테스트") // write our text comment
      .endCell();

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: recieveAddress, // destination address
          amount: toNano(amount).toString(), //Toncoin in nanotons
          payload: body.toBoc().toString("base64"), // payload with comment in body
        },
      ],
    };
    tonConnectUI.sendTransaction(tx);
  };

  const onCickIkekTx = () => {
    if (!amount) {
      alert("수량입력하세요");
      return;
    }
    if (!wallet?.account.address) {
      alert("지갑연결하세요");
      return;
    }
    if (!recieveAddress) {
      alert("받는주소 입력하세요");
      return;
    }

    if (!jettonAddress) {
      alert("토큰미보유");
      return;
    }

    if (!TonWeb.utils.Address.isValid(recieveAddress)) {
      alert("유효하지 않은 주소");
      return;
    }

    const destinationAddress = Address.parse(recieveAddress);

    const forwardPayload = beginCell()
      .storeUint(0, 32) // 0 opcode means we have a comment
      .storeStringTail("Hello, TON!")
      .endCell();

    const body = beginCell()
      .storeUint(0xf8a7ea5, 32) // opcode for jetton transfer
      .storeUint(0, 64) // query id
      .storeCoins(toNano(amount)) // jetton amount, amount * 10^9
      .storeAddress(destinationAddress) // TON wallet destination address
      .storeAddress(destinationAddress) // response excess destination
      .storeBit(0) // no custom payload
      .storeCoins(toNano(0.02)) // forward amount (if >0, will send notification message)
      .storeBit(1) // we store forwardPayload as a reference
      .storeRef(forwardPayload)
      .endCell();

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: jettonAddress, // sender jetton wallet
          amount: toNano(0.07).toString(), // for commission fees, excess will be returned
          payload: body.toBoc().toString("base64"), // payload with jetton transfer and comment body
        },
      ],
    };

    tonConnectUI.sendTransaction(tx);
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

        <button onClick={() => open()}>Open modal</button>
        <button onClick={() => close()}>Close modal</button>

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
              <div>
                <span>받는주소</span>
                <input
                  type="text"
                  value={recieveAddress}
                  onChange={(e) => setRecieveAddress(e.target.value)}
                />
                <span>수량</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  style={{
                    border: "2px solid green",
                    padding: "10px",
                    cursor: "pointer",
                    background: "gray",
                    color: "white",
                  }}
                  onClick={onClickTonTx}
                >
                  TON 전송 버튼
                </button>
                <button
                  style={{
                    border: "2px solid green",
                    padding: "10px",
                    cursor: "pointer",
                    background: "gray",
                    color: "white",
                  }}
                  onClick={onCickIkekTx}
                >
                  IKEK 전송 버튼
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
