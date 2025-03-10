import { useRef, useState } from "react";

const JumpIframe: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  // 카메라 활성화
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("카메라 접근 실패:", err);
    }
  };

  // 사진 찍기
  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setImage(dataUrl);
    }
  };

  // 이미지 저장
  const saveImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = `captured_${Date.now()}.png`; // 이미지 파일 이름 설정
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 다운로드 후 삭제
  };

  return (
    <div>
      <h3>신분증 촬영</h3>
      <video
        ref={videoRef}
        autoPlay
        style={{ width: "100%", maxHeight: "300px" }}
      />
      <button onClick={startCamera}>카메라 시작</button>
      <button onClick={captureImage}>사진 촬영</button>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={640}
        height={480}
      />
      {image && (
        <>
          <img
            src={image}
            alt="Captured"
            style={{ width: "100%", marginTop: "10px" }}
          />
          <button onClick={saveImage}>이미지 저장</button>
        </>
      )}
    </div>
  );
};

export default JumpIframe;
