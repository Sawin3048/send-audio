interface Params {
  url: string
  fileName: string
}

export function downloadAnyting({ fileName, url }: Params) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

export function downloadByBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  downloadAnyting({ fileName, url })
}