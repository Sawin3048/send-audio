import { RecordAudio } from "./audio";
// import { downloadByBlob } from "./downloader";
import { sendAudio } from "./upload-audio";

const recorder = new RecordAudio()
const btn = document.getElementById('btnComenzarGrabacion') as HTMLButtonElement
const resultAria = document.getElementById("result") as HTMLElement


let recording = false

const updateBtnStyle = () => btn.style.background = recording ? "green" : "red"

// const handelAudio = (blob: Blob) => downloadByBlob(blob, 'audio.mp3')
const handelAudio = (blob: Blob) => {
  sendAudio(blob).then(r => {
    resultAria.innerText = JSON.stringify(r)
  })
}

const toggle = async () => {
  recording
    ? recorder.stop().then(r => {
      handelAudio(r)
    })
    : recorder.start()
  console.log('toggle')
  recording = !recording
  updateBtnStyle()
}

btn.addEventListener('click', toggle)
