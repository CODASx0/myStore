let detections = {};

const videoElement = document.getElementById('video');

//将视频画面左右镜像
videoElement.style.transform = 'scaleX(-1)';

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});
faceMesh.setOptions({
    maxNumFaces: 1,
    modelSelection: 1,
});

function gotFaces(results) {
    detections = results;
    // console.log(detections);

}

faceMesh.onResults(gotFaces);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({ image: videoElement });
    },
    width: 640,
    height: 480
});

camera.start();
