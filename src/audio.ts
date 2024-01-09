// Polyfill para que funcione igual en todos los navegadores
import AudioRecorder from 'audio-recorder-polyfill'
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder'

AudioRecorder.encoder = mpegEncoder
AudioRecorder.prototype.mimeType = 'audio/mpeg'
window.MediaRecorder = AudioRecorder

// Objeto para manejar mejor
export class RecordAudio {
  private isRecording = false
  private mediaRecorder: MediaRecorder | null = null
  private audioFragments: Blob[] = []
  private audio: Blob | null = null
  private stream: MediaStream | null = null

  constructor(audioDeviceId?: string) {
    const params = { audio: audioDeviceId ? { deviceId: audioDeviceId } : true }

    navigator.mediaDevices.getUserMedia(params).then(
      (stream) => {
        this.stream = stream
        this.mediaRecorder = new MediaRecorder(stream)

        this.mediaRecorder.addEventListener("dataavailable", (evt) => this.audioFragments.push(evt.data))

      }
    )

  }

  start() {
    if (this.mediaRecorder === null) return console.error('mediaRecorder no lo encuentro')
    if (this.isRecording) console.error('Ya se esta grabando')

    this.isRecording = true

    this.mediaRecorder.start()
    this.mediaRecorder.addEventListener("dataavailable", (evt) => this.audioFragments.push(evt.data))

  }

  stop(): Promise<Blob> {
    return new Promise((res, rej) => {
      if (!this.isRecording) return rej('No se esta grabando')


      if (this.mediaRecorder === null) return rej('MediaRecorder no esta disponible, esto no deberia de pasar')
      this.mediaRecorder.addEventListener("stop", () => {
        this.stream?.getTracks().forEach(track => track.stop())

        this.audio = new Blob(this.audioFragments)

        res(this.audio)
        this.audio = null
      })

      // Restarting values
      this.audioFragments = []
      this.mediaRecorder.stop()
      this.isRecording = false
      // console.log('esto se sigue ejecutando')
    })
  }
}
