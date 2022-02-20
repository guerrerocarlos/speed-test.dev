var ws = new WebSocket("wss://kcb2ee9ega.execute-api.eu-west-3.amazonaws.com/prod");
let region = 'eu-west-3'
ws.addEventListener('open', () => {
  console.log('WebSocket is open now.', WebSocket.extensions)
  ws.send(JSON.stringify({ status: "ok" }));
  ws.send(JSON.stringify({ traceroute: { region } }));
  // ws.send(JSON.stringify({ traceroute: { region: 'us-west-1' } }));
  // ws.send(JSON.stringify({ traceroute: { region: 'eu-west-3' } }));
  // ws.send(JSON.stringify({ traceroute: { region: 'ca-central-1' } }));
  // ws.send(JSON.stringify({ traceroute: { region: 'eu-west-2' } }));
  // ws.send(JSON.stringify({ traceroute: { region: 'ap-south-1' } }));
  // ws.send(JSON.stringify({ traceroute: { region: 'ap-northeast-1' } }));
  // ws.send(JSON.stringify({ traceroute: { region: 'sa-east-1' } }));
})
ws.addEventListener('close', () => {
  console.log('WebSocket is closed now.')
})

lines = document.createElement('div')
ws.addEventListener('message', function (event) {
  let trace = JSON.parse(event.data)
  // console.log('🍊 message', event)
  // if (trace.region == 'us-east-1') {
  try {
    let time = parseFloat(trace.rtt1.split(" ")[0])
    if (time > 10) {
      let line = document.createElement('div')
      line.textContent = `${trace.rtt1} ${trace.ip}`
      whois(trace.ip, (whois) => {
        let checkWhoisPieces = ["Organization", "org-name", "country", 'descr']
        let whoisArray = []
        checkWhoisPieces.forEach((piece) => {
          if (whois[piece]) {
            whoisArray = whoisArray.concat(whois[piece])
          }
        })
        let lineContent = `${trace.rtt1} ${trace.ip} : ${whoisArray.join(" ")} `
        console.log("SET LINE", lineContent)
        line.textContent = lineContent
      })
      lines.appendChild(line)
    }
  } catch (err) {
    console.log("ERR", event, err)
  }
  // }
})

const traceroutes = document.getElementById("traceroutes")
traceroutes.appendChild(lines)

String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

function whois(ip, cb) {
  fetch("https://atrqipagi3.execute-api.eu-west-3.amazonaws.com/dev/whois?ip=" + ip)
    .then(result => result.text())
    .then(payload => {
      // console.log(ip, payload)
      let obj = {}
      let lines = payload.split("\n")
      let results = lines.filter((line) => line.indexOf(":") > -1 && line.indexOf("%") === -1)
      // console.log(results)
      results.forEach((result) => {
        let pieces = result.split(":")
        let value = pieces[1]
        // console.log(value, value.length)
        obj[pieces[0]] = obj[pieces[0]] || []
        obj[pieces[0]].push(value.trim())
      })
      cb(obj)
    })
}

let totals = {
  speeds: {},
  show: () => {
    console.log(totals.speeds)
    let sum = Object.keys(totals.speeds).reduce((prev, i) => prev + totals.speeds[i], 0)
    console.log("total:", sum * 8 / 1024, 'Mbps')
  }
}
let i = 0

function get(url, action = 'get', speedEngineHandler) {
  // const uploadProgress = document.getElementById("upload-progress");
  // const downloadProgress = document.getElementById("download-progress");
  let startedReceiving
  const xhr = new XMLHttpRequest();
  return new Promise((resolve) => {
    function updateSpeed(event) {
      if (event.lengthComputable) {
        // console.log("download progress:", event.loaded / event.total);
        if (!startedReceiving) startedReceiving = new Date()
        let speed = parseInt(event.loaded / (new Date() - startedReceiving))
        speedEngineHandler.update(i, speed)
        speedEngineHandler.showTotals()
        console.log("progress:", event.loaded, event.total, event.loaded / event.total, speed, " Bytes/s");
        // downloadProgress.value = event.loaded / event.total;
      }
    }

    xhr.upload.addEventListener("progress", updateSpeed);
    xhr.addEventListener("progress", updateSpeed)
      ;
    xhr.addEventListener("loadend", () => {
      resolve(xhr.responseText);
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

    // xhr.onreadystatechange = function (aEvt) {
    //   if (xhr.readyState == 4) {
    //      if(xhr.status == 200)
    //       console.log(req.responseText);
    //      else
    //       console.log("Error loading page\n");
    //   }
    // };
  });
  // console.log("success:", success);
}
var ii = 1
for (; ii < 3; ii++) {
  let peer = {
    nick: "AWS Cloudfront " + ii
  }
  get("https://cloudfront.speed-test.dev/24MB.zip?part="+ii, 'get', speedEngine(totals, newCDN(peer)))
  // get("https://cloudfront.speed-test.dev/24MB.zip?part="+ii, 'get', ii)
}
// for (; ii < 10; ii++) {
//   get("https://static.speed-test.dev/24MB.zip?part="+ii, 'get', ii)
// }
// for (; ii < 80; ii++) {
//   get("https://speed-test-eu-west-3.s3-website.eu-west-3.amazonaws.com/230MB.zip?part="+ii, 'get', ii)
// }

function speedEngine(totals) {
  return {
    update: (i, value) => {
      totals[i] = value
    },
    showTotals: () => {
      totals.show()
    }
  }
}



get("https://utils.r3js.com/geo", 'get', speedEngine(totals, newCDN()))
  .then((result) => {
    console.log("💚 get got", result)
  })