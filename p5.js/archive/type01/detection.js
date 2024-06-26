import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";


const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;


let faceLandmarker;
let runningMode = "VIDEO";

const videoWidth = 480;

const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: true,
    runningMode,
    numFaces: 1
});

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");


// 初始化相机
// getUsermedia parameters.



// Function to start the webcam stream.
function startWebcam() {
    // 获取所有设备
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            var videoDevices = [];
            var videoDeviceIndex = 0;
            devices.forEach(function (device) {
                console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
                // 如果设备是摄像头
                if (device.kind == 'videoinput') {
                    videoDevices[videoDeviceIndex++] = device.deviceId;
                }
            });
            // 选择第二个摄像头
            var constraints = {
                video: {
                    deviceId: { exact: videoDevices[cameraIndex] },
                    frameRate: { ideal: 60 },
                }
            };

            // 启动摄像头

            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);

                recorder = new MediaRecorder(stream,
                    { mimeType: 'video/webm; codecs=vp9' });
                recorder.ondataavailable = event => {
                    chunks.push(event.data);
                };

                recorder.onstop = () => { 
                    uploadVideo();
                }


            });
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });


}

// Start the webcam as soon as the page loads.
startWebcam();

let lastVideoTime = -1;
let results = undefined;
const drawingUtils = new DrawingUtils(canvasCtx);
async function predictWebcam() {
    const radio = video.videoHeight / video.videoWidth;
    video.style.width = videoWidth + "px";
    video.style.height = videoWidth * radio + "px";
    canvasElement.style.width = videoWidth + "px";
    canvasElement.style.height = videoWidth * radio + "px";
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;



    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = faceLandmarker.detectForVideo(video, startTimeMs);
    }
    if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
            detections = landmarks;
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#FFFFFF", lineWidth: 0.1 });
            /*
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
            */
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#FFFFFF", lineWidth: 2 });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#FFFFFF", lineWidth: 2 });

        }

    }
    window.requestAnimationFrame(predictWebcam);

}


