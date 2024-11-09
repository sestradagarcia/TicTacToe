// GestureRecognition.ts
import {
  GestureRecognizer,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let gestureRecognizer: GestureRecognizer;
let webcamRunning = false;
const videoWidth = 480;
const videoHeight = 360;

export const createGestureRecognizer = async (): Promise<void> => {
  const vision = await FilesetResolver.forVisionTasks(
      "@mediapipe/tasks-vision"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
          modelAssetPath: "../models/gesture_recognizer.task",
          delegate: "GPU"
      },
      runningMode: "VIDEO"
  });
};

export const enableWebcam = (videoElement: HTMLVideoElement): void => {
  if (webcamRunning) return;

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoElement.srcObject = stream;
      videoElement.onloadeddata = () => {
          webcamRunning = true;
          predictWebcam(videoElement);
      };
  });
};

export const predictWebcam = async (videoElement: HTMLVideoElement): Promise<string | null> => {
  const results = await gestureRecognizer.recognizeForVideo(videoElement, Date.now());

  if (results?.gestures?.length > 0) {
      const category = results.gestures[0][0].categoryName;
      return category;
  }
  return null;
};

export const stopWebcam = (): void => {
  webcamRunning = false;
};
