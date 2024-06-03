import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { BrowserRouter } from "react-router-dom";

// this manifest is used temporarily for development purposes
const manifestUrl =
  "https://seung-ik.github.io/telegram-tmo/tonconnect-manifest.json'";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter basename="/telegram-tmo/">
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </BrowserRouter>
);
