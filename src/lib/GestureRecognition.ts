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
  const vision = await FilesetResolver.forVisionTasks("@mediapipe/tasks-vision");
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "../models/gesture_recognizer.task", // Ensure this path is correct
      delegate: "GPU", // Use GPU for better performance
    },
    runningMode: "VIDEO", // Process video frames
  });
};

export const enableWebcam = (videoElement: HTMLVideoElement): void => {
  if (webcamRunning) return;

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.width = videoWidth;
      videoElement.height = videoHeight;
      videoElement.onloadeddata = () => {
        webcamRunning = true;
        predictWebcam(videoElement);
      };
    })
    .catch((error) => {
      console.error("Error accessing webcam:", error);
    });
};

export const predictWebcam = async (videoElement: HTMLVideoElement): Promise<void> => {
  if (!gestureRecognizer || !webcamRunning) return;

  const currentTimestamp = Date.now();

  try {
    const results = await gestureRecognizer.recognizeForVideo(videoElement, currentTimestamp);

    if (results?.gestures?.length > 0) {
      const gesture = results.gestures[0][0]; // First gesture in the results
      const category = gesture.categoryName;
      console.log("Detected Gesture:", category);

      // Example logic for game control
      if (category === "Open Palm") {
        // Code to move the player or the cursor
        console.log("Open Palm detected - Move");
        // Add logic to move the cursor or player here
      } else if (category === "Closed Fist") {
        // Code to confirm the selection
        console.log("Closed Fist detected - Select");
        // Add logic to confirm the selection here
      }
    }

    if (webcamRunning) {
      requestAnimationFrame(() => predictWebcam(videoElement));
    }
  } catch (error) {
    console.error("Error predicting gestures:", error);
  }
};

export const stopWebcam = (): void => {
  webcamRunning = false;
};
