import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";



const { FaceLandmarker, HandLandmarker, FilesetResolver, DrawingUtils } = vision;


let faceLandmarker, handLandmarker;
let runningMode = "VIDEO";

const videoWidth = 480;

const cameraWidthHere = cameraWidth / 2;
const cameraHeightHere = cameraHeight / 2;

const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");

//创建面部识别器
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

// 创建手部识别器
handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
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
                    frameRate: 60 ,
                    width: cameraWidthHere,
                    height: cameraHeightHere
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
        results = await faceLandmarker.detectForVideo(video, startTimeMs);
        
        resultsHand = await handLandmarker.detectForVideo(video, startTimeMs);
        
    }

    if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
            detections = landmarks;

            //drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#FFFFFF", lineWidth: 0.1 });
            //drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#FFFFFF", lineWidth: 2 });
            //drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#FFFFFF", lineWidth: 2 });

        }

    }

    if (resultsHand.landmarks) { 
        for (const landmarks of resultsHand.landmarks) {
            handDetections = landmarks;
            
            
        }  
    }

    window.requestAnimationFrame(predictWebcam);

}


