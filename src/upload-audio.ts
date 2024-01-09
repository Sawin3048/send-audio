import { apiURL } from "../env"

export async function sendAudio(audio: Blob) {
  const formData = new FormData();
  formData.append('file', audio, 'audio.mp3');

  const req = await fetch(apiURL, {
    method: 'POST',
    body: formData
  })

  return req.json()
}
