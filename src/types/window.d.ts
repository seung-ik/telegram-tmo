export {};

declare global {
  interface Window {
    TelegramWebviewProxy?: any; // Adjust the type based on the actual type of TelegramWebviewProxy
    Telegram?: any;

    __ctlArcadeStartSession: () => void;
    __ctlArcadeEndSession: () => void;
    __ctlArcadeSaveScore: (data: { score: number }) => void;
    __ctlArcadeUseTicket: () => void;
    __ctlArcadeShowInterlevelAD: () => void;
    __ctlArcadeShareEvent: (data: {
      img: string;
      title: string;
      msg: string;
      msg_share: string;
    }) => void;
  }
}
