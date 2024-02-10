

export function convertirWebMToMP3(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {


    const audio = new Audio();
    audio.src = URL.createObjectURL(blob);

    // Cuando el audio se carga, se activa esta función
    audio.onloadedmetadata = function () {
      // Crear un contexto de audio
      const audioContext = new AudioContext();

      // Crear un nodo de fuente de audio
      let fuente = audioContext.createMediaElementSource(audio);

      // Crear un nodo de destino de audio
      let destino = audioContext.createMediaStreamDestination();

      // Conectar la fuente al destino
      fuente.connect(destino);

      // Crear un grabador de medios
      let grabador = new MediaRecorder(destino.stream);

      // Array para almacenar los datos grabados
      let chunks: Blob[] = [];

      // Cuando se graba un trozo de datos, se agrega al array
      grabador.ondataavailable = function (event) {
        chunks.push(event.data);
      };

      // Cuando se termina la grabación, se convierten los datos en un Blob
      grabador.onstop = function (event) {
        let blob = new Blob(chunks, { 'type': 'audio/mp3' });
        let url = URL.createObjectURL(blob);
        resolve(blob)
        // Aquí puedes hacer algo con el archivo MP3, como descargarlo o reproducirlo
      };

      // Iniciar la grabación
      grabador.start();

      // Reproducir el audio
      audio.play();

      // Detener la grabación después de la duración del audio
      setTimeout(function () {
        grabador.stop();
      }, audio.duration * 1000);
    };

    // Cargar el audio
    audio.load();
  })
}