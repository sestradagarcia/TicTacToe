import {
  GestureRecognizer,
  FilesetResolver
} from "@mediapipe/tasks-vision";

export default async function GestureRecognition(
  videoElement: HTMLVideoElement, // Correctly typed as HTMLVideoElement
  gameHandlers: {
    handleLeft: () => void;
    handleRight: () => void;
    handleUp: () => void;
    handleDown: () => void;
    handleEnter: () => void;
  }
) {
  let gestureRecognizer: GestureRecognizer;
  let runningMode: string = "IMAGE";
  let webcamRunning: boolean = false;
  let lastVideoTime: number = -1;
  let results: any;

  // Initialize the gesture recognizer
  const createGestureRecognizer = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "models/gesture_recognizer.task",
          delegate: "GPU",
        },
        numHands: 1, 
        runningMode: runningMode,
      });
    } catch (error) {
      console.error("Error initializing gesture recognizer:", error);
    }    
  };

  await createGestureRecognizer();

  // Check if webcam access is supported
  const hasGetUserMedia = (): boolean =>
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  if (hasGetUserMedia()) {
    enableCam();
  } else {
    console.warn("getUserMedia() is not supported by your browser");
    return;
  }

  // Enable the live webcam view and start detection
  function enableCam() {
    if (!gestureRecognizer) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }

    webcamRunning = !webcamRunning;
    console.log(webcamRunning ? "webcam running" : "webcam not running");

    if (webcamRunning) {
      const constraints = { video: true };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        videoElement.srcObject = stream;
        videoElement.addEventListener("loadeddata", predictWebcam);
      });
    }
  }

  // Predict gestures from the webcam stream
  async function predictWebcam() {
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

    const nowInMs = Date.now();
    if (videoElement.currentTime !== lastVideoTime) {
      lastVideoTime = videoElement.currentTime;
      results = gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
    }

    // Update video and canvas dimensions
    videoElement.style.height = videoHeight;
    videoElement.style.width = videoWidth;

    let previousPosition = { x: 'left', y: 'top' }; // Initialize previous position

    if (results?.gestures?.length > 0) {
      const categoryName = results.gestures[0][0].categoryName;
      const handLandmarks = results.landmarks[0][0];

      if (categoryName === "Open_Palm") {
        const x = handLandmarks.x;
        const y = handLandmarks.y;

        // Determine the current position
        let currentPosition = { x: '', y: '' };

        // Determine c movement
        if (x >= 0.3 && x <= 0.6) {
          currentPosition.x = 'middle';
        } else if (x < 0.3) {
          currentPosition.x = 'right';
        } else if (x > 0.6) {
          currentPosition.x = 'left';
        }

        // Determine y movement
        if (y >= 0.3 && y <= 0.7) {
          currentPosition.y = 'middle';
        } else if (y < 0.3) {
          currentPosition.y = 'top';
        } else if (y > 0.7) {
          currentPosition.y = 'bottom';
        }

        // Handle all transitions
        const handleTransition = (prevX, prevY, currX, currY, handlers) => {
          if (previousPosition.x === prevX && previousPosition.y === prevY &&
            currentPosition.x === currX && currentPosition.y === currY) {
            handlers.forEach(handler => handler());
          }
        };

        // Define all possible transitions
        const transitions = [
          // Vertical movements
          { prev: ['middle', 'middle'], curr: ['middle', 'bottom'], handlers: [gameHandlers.handleDown] },
          { prev: ['middle', 'bottom'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleUp] },
          { prev: ['middle', 'middle'], curr: ['middle', 'top'], handlers: [gameHandlers.handleUp] },
          { prev: ['middle', 'top'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleDown] },

          // Horizontal movements
          { prev: ['middle', 'middle'], curr: ['left', 'middle'], handlers: [gameHandlers.handleLeft] },
          { prev: ['middle', 'middle'], curr: ['right', 'middle'], handlers: [gameHandlers.handleRight] },
          { prev: ['left', 'middle'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleRight] },
          { prev: ['right', 'middle'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleLeft] },

          // Diagonal movements
          { prev: ['middle', 'middle'], curr: ['left', 'top'], handlers: [gameHandlers.handleLeft, gameHandlers.handleUp] },
          { prev: ['middle', 'middle'], curr: ['right', 'bottom'], handlers: [gameHandlers.handleRight, gameHandlers.handleDown] },
          { prev: ['middle', 'middle'], curr: ['right', 'top'], handlers: [gameHandlers.handleRight, gameHandlers.handleUp] },
          { prev: ['middle', 'middle'], curr: ['left', 'bottom'], handlers: [gameHandlers.handleLeft, gameHandlers.handleDown] },

          // Edge to center transitions
          { prev: ['left', 'top'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleRight, gameHandlers.handleDown] },
          { prev: ['right', 'bottom'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleLeft, gameHandlers.handleUp] },
          { prev: ['right', 'top'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleLeft, gameHandlers.handleDown] },
          { prev: ['left', 'bottom'], curr: ['middle', 'middle'], handlers: [gameHandlers.handleRight, gameHandlers.handleUp] },

          // Top row transitions
          { prev: ['left', 'top'], curr: ['middle', 'top'], handlers: [gameHandlers.handleRight] },
          { prev: ['middle', 'top'], curr: ['right', 'top'], handlers: [gameHandlers.handleRight] },
          { prev: ['right', 'top'], curr: ['middle', 'top'], handlers: [gameHandlers.handleLeft] },
          { prev: ['middle', 'top'], curr: ['left', 'top'], handlers: [gameHandlers.handleLeft] },

          // Bottom row transitions
          { prev: ['left', 'bottom'], curr: ['middle', 'bottom'], handlers: [gameHandlers.handleRight] },
          { prev: ['middle', 'bottom'], curr: ['right', 'bottom'], handlers: [gameHandlers.handleRight] },
          { prev: ['right', 'bottom'], curr: ['middle', 'bottom'], handlers: [gameHandlers.handleLeft] },
          { prev: ['middle', 'bottom'], curr: ['left', 'bottom'], handlers: [gameHandlers.handleLeft] },

          // Left column transitions
          { prev: ['left', 'top'], curr: ['left', 'middle'], handlers: [gameHandlers.handleDown] },
          { prev: ['left', 'middle'], curr: ['left', 'bottom'], handlers: [gameHandlers.handleDown] },
          { prev: ['left', 'bottom'], curr: ['left', 'middle'], handlers: [gameHandlers.handleUp] },
          { prev: ['left', 'middle'], curr: ['left', 'top'], handlers: [gameHandlers.handleUp] },

          // Right column transitions
          { prev: ['right', 'top'], curr: ['right', 'middle'], handlers: [gameHandlers.handleDown] },
          { prev: ['right', 'middle'], curr: ['right', 'bottom'], handlers: [gameHandlers.handleDown] },
          { prev: ['right', 'bottom'], curr: ['right', 'middle'], handlers: [gameHandlers.handleUp] },
          { prev: ['right', 'middle'], curr: ['right', 'top'], handlers: [gameHandlers.handleUp] },
        ];

        // Apply all transitions
        transitions.forEach(({ prev, curr, handlers }) => {
          handleTransition(prev[0], prev[1], curr[0], curr[1], handlers);
        });

        // Update previous position
        previousPosition = currentPosition;
      } else if (categoryName === "Closed_Fist") {
        gameHandlers.handleEnter();
      }
    }

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  }
}
