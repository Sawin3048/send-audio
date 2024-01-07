import AudioRecorder from 'audio-recorder-polyfill'
window.MediaRecorder = AudioRecorder

const init = () => {
  // const tieneSoporteUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

  // if (typeof MediaRecorder === "undefined" || !tieneSoporteUserMedia())
  //   return alert("Tu navegador web no cumple los requisitos");

  // DOM
  const $select = document.querySelector("#listaDeDispositivos") as HTMLSelectElement,
    $btnComenzarGrabacion = document.querySelector("#btnComenzarGrabacion") as HTMLButtonElement,
    $btnDetenerGrabacion = document.querySelector("#btnDetenerGrabacion") as HTMLButtonElement;

  console.log($select, $btnComenzarGrabacion, $btnDetenerGrabacion)
  const limpiarSelect = () => {
    for (let x = $select.options.length - 1; x >= 0; x--) {
      $select.options.remove(x);
    }
  };

  // Variables "globales"
  let mediaRecorder: MediaRecorder | null;

  const llenarLista = () => {
    navigator.mediaDevices.enumerateDevices().then((dispositivos) => {
      limpiarSelect();
      dispositivos.forEach((dispositivo, indice) => {
        console.log(dispositivos)
        if (dispositivo.kind === "audioinput") {
          const $opcion = document.createElement("option");
          $opcion.text = dispositivo.label || `Dispositivo ${indice + 1}`;
          $opcion.value = dispositivo.deviceId;
          $select.appendChild($opcion);
        }
      });
    });
  };

  const comenzarAGrabar = () => {
    if (!$select.options.length) return alert("No hay dispositivos");
    if (mediaRecorder) return alert("Ya se está grabando");

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: $select.value,
        },
      })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/mpeg" });
        mediaRecorder.start();

        const fragmentosDeAudio: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", (evento) => {
          fragmentosDeAudio.push(evento.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          stream.getTracks().forEach((track) => track.stop());
          console.log(fragmentosDeAudio)
          const blobAudio = new Blob(fragmentosDeAudio);
          // Descargar
          const formData = new FormData();
          formData.append('archivo', blobAudio, 'nombre_archivo.mp3');
          // Realizar la solicitud POST utilizando fetch
          fetch('/', {
            method: 'POST',
            body: formData
          })
            .then(response => {
              // Manejar la respuesta aquí
              console.log(response);
              formData.delete('archivo')
            })
            .catch(error => {
              // Manejar errores aquí
              console.error('Error:', error);
              formData.delete('archivo')
            });
          // const urlParaDescargar = URL.createObjectURL(blobAudio);

          // let a = document.createElement("a");
          // document.body.appendChild(a);
          // a.href = urlParaDescargar;
          // a.download = "grabacion.mp3";
          // a.click();
          // window.URL.revokeObjectURL(urlParaDescargar);
        });
      })
      .catch((error) => {
        console.log(error);
        alert("No me diste permiso?");
      });
  };

  const detenerGrabacion = () => {
    if (!mediaRecorder) return alert("No se está grabando");
    mediaRecorder.stop();
    mediaRecorder = null;
  };

  $btnComenzarGrabacion.addEventListener("click", comenzarAGrabar);
  $btnDetenerGrabacion.addEventListener("click", detenerGrabacion);

  llenarLista();
};
document.addEventListener("DOMContentLoaded", () => setTimeout(init, 3000));
