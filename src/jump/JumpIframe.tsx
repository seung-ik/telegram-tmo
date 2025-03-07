import Telegram from "@twa-dev/sdk";

const JumpIframe: React.FC = () => {
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    Telegram.requestWriteAccess(); // 파일 업로드 권한 요청
    const formData = new FormData();

    formData.append("photo", file);
    console.log(formData);

    // const response = await fetch("/api/kyc/upload", {
    //   method: "POST",
    //   body: formData,
    // });

    // const data = await response.json();
    // alert(data.message);
  };
  return (
    <div style={{ width: "100%", height: "calc(100% - 20px)" }}>
      <div>
        <h3>신분증 촬영</h3>
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default JumpIframe;
