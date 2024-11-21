import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import saveAs from "file-saver";
import Hs from "../assets/fourcut/인생네컷_로고.png";
import GOONYE from "../assets/images/goongYeImage.png";

const TakePhotosPage = () => {
    const divRef = useRef(null);
    const canvasRef = useRef(null);
    const handleDownload = async () => {
        if (!divRef.current) return;

        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

        try {
            const canvas = await html2canvas(divRef.current, { scale: 2 });
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `${formattedDate}.png`);
                }
            });
        } catch (error) {
            console.error("Error converting div to image:", error);
        }
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = GOONYE;

        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // 캔버스에 이미지 그리기
        };
    }, []);

    return (
        <div>
            <div
                ref={divRef}
                style={{
                    backgroundColor: "lime",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    position: "relative", // 부모 요소에 상대적 위치 설정
                }}
            >
                <h2>화면 캡쳐, 저장 예제</h2>
                <img
                    src={Hs}
                    alt="xxxxx"
                    style={{
                        width: "100%",
                        height: "auto",
                        position: "relative",
                        zIndex: 1,
                        border: "5px solid black",
                        borderRadius: "10px",
                    }} // 이미지의 z-index를 낮춰 캔버스 위로 오도록 설정
                />

                {/* 50x50 픽셀 캔버스 4개 배치 */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(255, 0, 0, 0.5)", // 반투명 빨간색 캔버스
                        top: "10%", // 상단에서 20px 떨어진 위치
                        left: "5%", // 좌측에서 20px 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                />
                <canvas
                    ref={canvasRef} // 캔버스 참조 추가
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(0, 100, 0, 0.5)", // 반투명 초록색 캔버스
                        top: "10%", // 상단에서 10% 떨어진 위치
                        right: "5%", // 우측에서 5% 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                    width={200} // 캔버스의 실제 너비
                    height={200} // 캔버스의 실제 높이
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(0, 0, 255, 0.5)", // 반투명 파란색 캔버스
                        bottom: "30%", // 상단에서 80px 떨어진 위치
                        right: "5%", // 좌측에서 20px 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(255, 255, 0, 0.5)", // 반투명 노란색 캔버스
                        bottom: "30%", // 상단에서 80px 떨어진 위치
                        left: "5%", // 좌측에서 80px 떨어진 위치
                        zIndex: 2, // 캔버스의 z-index를 높여 이미지 위로 오도록 설정
                    }}
                />
            </div>
            <button onClick={handleDownload}>다운로드</button>
        </div>
    );
};

export default TakePhotosPage;
