const facePoint = {
    leftEyeTop: 124,
    rightEyeTop: 276,
    leftEyeBottom: 111,
};

export const calculateFilterPosition = (keypoints) => {
    const xPadding = 30;
    const yPadding = 10;

    const x = keypoints[facePoint.leftEyeTop].x - xPadding;
    const y = keypoints[facePoint.leftEyeTop].y - yPadding;
    const width =
        keypoints[facePoint.rightEyeTop].x -
        keypoints[facePoint.leftEyeTop].x +
        xPadding * 2;
    const height =
        keypoints[facePoint.leftEyeBottom].y -
        keypoints[facePoint.leftEyeTop].y +
        yPadding * 2;
    console.log(x, y, width, height, "값이다 ~~~~~~~");
    return {
        x,
        y,
        width,
        height,
    };
};
