const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");
const playnPausebtn = document.getElementById("playnPausebtn");
const recordedVideo = document.getElementById("video-player");
const downloadbtn = document.getElementById("downloadbtn");
var mediaRecorder;

async function startRecording() {
  try {
    captureStream = await navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
        width: VisualViewport.width,
        height: visualViewport.height,
      })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        const recordedChunks = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        });
        mediaRecorder.addEventListener("stop", () => {
          const recordedBlob = new Blob(recordedChunks);
          const recordedVideoUrl = URL.createObjectURL(recordedBlob);
          recordedVideo.src = recordedVideoUrl;
        });
      });
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.stream.getTracks().forEach((track) => {
    track.stop();
  });
}

function playnPause() {
  recordedVideo.paused ? recordedVideo.play() : recordedVideo.pause();
}

function downloadVideo() {
  const a = document.createElement("a");
  a.href = recordedVideo.src;
  a.download = "video.webm";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

start.addEventListener("click", startRecording);
stop.addEventListener("click", stopRecording);
playnPausebtn.addEventListener("click", playnPause);
downloadbtn.addEventListener("click", downloadVideo);
