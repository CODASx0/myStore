import { FaceLandmarker, HandLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";






let faceLandmarker, handLandmarker;
let runningMode = "VIDEO";

const videoWidth = 480;

const cameraWidthHere = cameraWidth / 2;
const cameraHeightHere = cameraHeight / 2;

const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");

//创建面部识别器
faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
        modelAssetPath: `./models/face_landmarker.task`,
        delegate: "GPU"
    },
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
    runningMode,
    numFaces: 1
});

// 创建手部识别器
handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
        modelAssetPath: `./models/hand_landmarker.task`,
        delegate: "GPU"
    },
    runningMode,
    numHands: 1
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
                    frameRate: 30,
                    width: cameraWidthHere,
                    height: cameraHeightHere,

                }
            };

            // 启动摄像头

            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                //videoDetection = stream;

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

let resultsHand = undefined;


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
        [results, resultsHand] = await Promise.all([
            faceLandmarker.detectForVideo(video, startTimeMs),
            handLandmarker.detectForVideo(video, startTimeMs)
        ]);
    }

    if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
            detections = landmarks;

        }

    }

    if (resultsHand.landmarks) {
        for (const landmarks of resultsHand.landmarks) {
            handDetections = landmarks;

        }
    }

    if (!lipIndicator.active) {
        setTimeout(predictWebcam, 1000 / 6);
    } else if (handIndicator.active && handIndicator.state != 'active') {
        setTimeout(predictWebcam, 1000 / 30); // 1000毫秒等于1秒
    } else {
        setTimeout(predictWebcam, 1000 / 12); // 1000毫秒等于1秒
    }


}

