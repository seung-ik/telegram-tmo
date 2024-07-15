// import classNames from "classnames";
// import styles from "./index.module.scss";

// const cx = classNames.bind(styles);

const TaptenIframe: React.FC = () => {
  console.log("fobletalk");
  return (
    <div style={{ width: "100%", height: "calc(100% - 20px)" }}>
      <iframe
        src="/telegram-tmo/game/jump/index.html"
        title="HTML5 Game"
        style={{ border: "none", width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
};

export default TaptenIframe;
