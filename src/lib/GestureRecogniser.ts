import {
  GestureRecognizer,
  FilesetResolver
} from "@mediapipe/tasks-vision";

let gestureRecognizer: GestureRecognizer;
let runningMode = "IMAGE";
let webcamRunning = false;

const videoHeight = "360px";
const videoWidth = "480px";

const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks("@mediapipe/tasks-vision");
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "../models/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
  });
  return gestureRecognizer;
};

let lastVideoTime = -1;

const predictWebcam = async (videoElement, gameHandlers) => {
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
  }

  if (videoElement.currentTime !== lastVideoTime) {
    lastVideoTime = videoElement.currentTime;
    const results = gestureRecognizer.recognizeForVideo(videoElement, Date.now());

    if (results?.gestures?.length > 0) {
      const categoryName = results.gestures[0][0].categoryName;
      const handLandmarks = results.landmarks[0][0];

      if (categoryName === "Open_Palm") {
        const x = handLandmarks.x;
        const y = handLandmarks.y;

        if (x < 0.3) gameHandlers.handleLeft();
        else if (x > 0.6) gameHandlers.handleRight();

        if (y < 0.3) gameHandlers.handleUp();
        else if (y > 0.7) gameHandlers.handleDown();
      } else if (categoryName === "Closed_Fist") {
        gameHandlers.handleEnter();
      }
    }
  }

  if (webcamRunning) {
    window.requestAnimationFrame(() => predictWebcam(videoElement, gameHandlers));
  }
};

const enableWebcam = async (videoElement, gameHandlers) => {
  if (!gestureRecognizer) {
    await createGestureRecognizer();
  }

  if (webcamRunning) {
    webcamRunning = false;
  } else {
    webcamRunning = true;

    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoElement.srcObject = stream;
      videoElement.addEventListener("loadeddata", () =>
        predictWebcam(videoElement, gameHandlers)
      );
    });
  }
};

export { enableWebcam };
