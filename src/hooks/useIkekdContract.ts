import { useState, useEffect } from "react";
import { useTonClient } from "./useTonClient";
import { Address } from "@ton/core";
import { JettonMaster } from "@ton/ton";
import { useTonAddress } from "@tonconnect/ui-react";

export function useIkekContract() {
  const client = useTonClient();
  const userAddr = useTonAddress();
  const [jettonAddress, setJettonAddress] = useState<string | null>(null); // 상태 변수 추가

  useEffect(() => {
    if (!client || !userAddr) return;

    const jettonMasterAddress = Address.parse(
      "kQB_lU2eWs86jmDGVwYgmB-2XWQ0WEYYPval-1zmFVlM2piZ"
    );
    const userAddress = Address.parse(userAddr);

    const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));

    const getter = async () => {
      const walletAddr = await jettonMaster.getWalletAddress(userAddress);
      setJettonAddress(walletAddr.toString()); // Address 객체를 문자열로 변환하여 상태 업데이트
    };

    getter();
  }, [client, userAddr]);

  return { jettonAddress }; // 상태 반환
}
