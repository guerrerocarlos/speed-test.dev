function get(url, action = 'get', speedEngineHandler, completeCallback = () => { }) {
  let startedReceiving
  const xhr = new XMLHttpRequest();
  return new Promise((resolve) => {
    function updateSpeed(event) {
      if (event.lengthComputable) {
        if (!startedReceiving) startedReceiving = new Date()
        let speed = parseInt(event.loaded * 8 / (new Date() - startedReceiving))
        if (speedEngineHandler) speedEngineHandler.update(i, speed, event.loaded || 0, event.total || 0)
      }
    }

    xhr.upload.addEventListener("progress", updateSpeed);
    xhr.addEventListener("progress", updateSpeed);
    xhr.addEventListener("loadend", () => {
      if (speedEngineHandler) speedEngineHandler.update(i, 0)
      completeCallback()
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch {
        resolve(xhr.responseText);
      }
      // resolve(xhr.readyState === 4 && xhr.status === 200);
    });

    if (action === 'get') {
      xhr.open("GET", url, true);
      xhr.send();
    }

    if (action === 'put') {
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      const blob = new Blob([new Uint8Array(10 * 1024 * 1024)]); // any Blob, including a File
      xhr.send(blob); ``
    }

  });
}