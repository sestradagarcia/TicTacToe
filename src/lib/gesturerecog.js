import {
  GestureRecognizer,
  FilesetResolver
} from "@mediapipe/tasks-vision";
  
  let gestureRecognizer: GestureRecognizer;
  let runningMode = "IMAGE";
  let enableWebcamButton: HTMLButtonElement;
  let webcamRunning: Boolean = false;
  const videoHeight = "360px";
  const videoWidth = "480px";
  
  // Before we can use HandLandmarker class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.
  const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "GPU"
      },
      runningMode: runningMode
    });
  };
  createGestureRecognizer();
  
  /********************************************************************
  // Continuously grab image from webcam stream and detect it.
  ********************************************************************/
  
  const video = document.getElementById("webcam");
  const gestureOutput = document.getElementById("gesture_output");
  
  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it.
  if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
  } else {
    console.warn("getUserMedia() is not supported by your browser");
  }
  
  // Enable the live webcam view and start detection.
  function enableCam(event) {
    if (!gestureRecognizer) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }
  
    if (webcamRunning === true) {
      webcamRunning = false;
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
      webcamRunning = true;
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
  
    // getUsermedia parameters.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
       video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
     });
  }
  
  let lastVideoTime = -1;
  let results = undefined;
  async function predictWebcam() {
    const webcamElement = document.getElementById("webcam");
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }
  
    webcamElement.style.height = videoHeight;
    webcamElement.style.width = videoWidth;
  
    if (results.gestures.length > 0) {
      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore = parseFloat(
        results.gestures[0][0].score * 100
      ).toFixed(2);
      const handedness = results.handednesses[0][0].displayName;
      const landMarks = results.landmarks[0][0];
      let xMovement = ''
      let yMovement = ''
      let action = ''
          if (categoryName === "Open_Palm") {
            let handLandmarks = results.landmarks[0][0];
          // Determine x movement
          if (handLandmarks.x >= 0.3 && handLandmarks.x <= 0.6) {
              xMovement = 'middle';
          } else if (handLandmarks.x < 0.3) {
              xMovement = 'right';
          } else if (handLandmarks.x > 0.6) {
              xMovement = 'left';
          }
  
          // Determine y movement
          if (handLandmarks.y >= 0.3 && handLandmarks.y <= 0.7) {
              yMovement = 'middle';
          } else if (handLandmarks.y < 0.3) {
              yMovement = 'up';
          } else if (handLandmarks.y > 0.7) {
              yMovement = 'down';
          }
  
          // Set action to 'moving' only if xMovement or yMovement are set
          if (xMovement || yMovement) {
              action = 'moving';
          }
  
      } else if (categoryName === "Closed_Fist") {
          action = 'place';
      }
      // Area of text output
      gestureOutput.style.display = "block";
      gestureOutput.style.width = videoWidth;
      // Setting text of p element
      gestureOutput.innerText = `GestureRecogniser: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}\n Position: \n x: ${landMarks.x}\n  y: ${landMarks.y}\n Action: \n ${xMovement} \n ${yMovement}\n ${action}\n`;
    } else {
      gestureOutput.style.display = "none";
    }
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }