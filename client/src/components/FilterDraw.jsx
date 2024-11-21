import { useEffect, useRef, useState } from "react";
import { calculateFilterPosition } from "./utils/calculate-filter-position";
import { loadDetectionModel } from "./utils/load-detection-model";

const FilterDraw = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const initialLoadedRef = useRef(false);
    const [status, setStatus] = useState("Initializing...");

    const videoSize = {
        width: 640,
        height: 480,
    };

    const estimateFacesLoop = (model, image, ctx) => {
        const video = videoRef.current?.video;

        if (!video) return;

        model.estimateFaces(video).then((face) => {
            ctx.clearRect(0, 0, videoSize.width, videoSize.height);
            if (face[0]) {
                const { x, y, width, height } = calculateFilterPosition(
                    face[0].keypoints
                );
                console.log("=======", x, y, width, height);
                ctx.drawImage(image, x, y, width, height);
            }
            requestAnimationFrame(() => estimateFacesLoop(model, image, ctx));
        });
    };
    useEffect(() => {
        const canvasContext = canvasRef.current?.getContext("2d");

        if (!canvasContext || initialLoadedRef.current) return;

        initialLoadedRef.current = true;

        const image = new Image();
        image.src = "../assets/fourcut/sunglasses.png";

        setStatus("Load Model...");

        loadDetectionModel().then((model) => {
            setStatus("Model Loaded");
            requestAnimationFrame(() =>
                estimateFacesLoop(model, image, canvasContext)
            );
        });
    }, []);

    return (
        <>
            <canvas
                width={videoSize.width}
                height={videoSize.height}
                ref={canvasRef}
                className="filter-canvas"
            />
            <p className="status">{status}</p>
        </>
    );
};

export default FilterDraw;
