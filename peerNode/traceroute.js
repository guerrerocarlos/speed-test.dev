function traceroute(geo) {

  let regions = {
    "us-east-1": { name: "US_East" },
    "us-west-1": { name: "US_West" },
    "eu-west-3": { name: "France" },
    "ca-central-1": { name: "Canada" },
    "eu-west-2": { name: "England" },
    "ap-south-1": { name: "India" },
    "ap-northeast-1": { name: "Japan" },
    "sa-east-1": { name: "Brazil" },
    // "me-south-1": { name: "Bahrain" },
    // "ap-southeast-2": { name: "Australia" },
    // "af-south-1": { name: "Cape Town" },
    // "ap-east-1": { name: "Hong Kong" },
  }

  let countries = []

  const traceroutes = document.getElementById("traceroutes")
  const terminalLines = {}

  Object.keys(regions).forEach((region) => {
    console.log("terminal for region", region)
    terminalLines[region] = []

    let terminal = document.createElement('div')
    terminal.classList = "terminal"

    for (let line = 0; line < 51; line++) {
      let terminalLine = document.createElement('a')
      terminalLine.classList.add("terminalLine")
      terminalLine.classList.add("displayBlock")
      
      if (line === 0) {
        terminalLine.textContent = `${regions[region].name}_AWS_${region}$ traceroute ${geo.ip}`
        terminalLine.classList = 'terminalLineDestination'
      }
      terminalLines[region].push(terminalLine)
      terminal.appendChild(terminalLine)
    }
    terminalLines[region][50].classList = 'terminalLineDestination'
    traceroutes.appendChild(terminal)
  })

  var ws = new WebSocket("wss://kcb2ee9ega.execute-api.eu-west-3.amazonaws.com/prod");
  // let region = 'eu-west-3'
  ws.addEventListener('open', () => {
    console.log('WebSocket is open now.', WebSocket.extensions)
    ws.send(JSON.stringify({ status: "ok" }));
    Object.keys(regions).forEach((region) => {
      ws.send(JSON.stringify({ traceroute: { region } }));
    })
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
      console.log("trace:", trace)
      let time = parseFloat(trace.rtt1.split(" ")[0])
      if (time > 0) {
        let line = document.createElement('div')
        line.textContent = `${trace.rtt1} ${trace.ip}`

        terminalLines[trace.region][trace.hop + 1].textContent = `${trace.rtt1} ${trace.ip}`

        regions[trace.region].maxLatency = regions[trace.region].maxLatency || 0
        regions[trace.region].maxHops = regions[trace.region].maxHops || 0

        if (regions[trace.region].maxLatency < parseFloat(trace.rtt1.split(" ")[0])) {
          regions[trace.region].maxLatency = parseFloat(trace.rtt1.split(" ")[0])
        }
        regions[trace.region].maxHops++
        terminalLines[trace.region][50].textContent = `${regions[trace.region].maxLatency} ms ${geo.ip} (${regions[trace.region].maxHops} hops)`

        whois(trace.ip, (whois) => {
          let checkWhoisPieces = ["Organization", "org-name", "country", 'descr']
          let whoisArray = []
          checkWhoisPieces.forEach((piece) => {
            if (whois[piece]) {
              whoisArray = whoisArray.concat(whois[piece])
            }
          })

          // let lineContent = `${trace.rtt1} ${trace.ip}: ${whoisArray.join(" ")} `
          // console.log("SET LINE", lineContent)
          if (whois["OrgId"] && whois["OrgId"][0] && whois["OrgId"][0] === "IANA") {

          } else {
            if (whoisArray.length > 0) {
              get(`https://utils.s.r3js.com/geo?ip=${trace.ip}`).then(geo => {
                terminalLines[trace.region][trace.hop + 1].textContent += ` ${geo.geo.countryData.emoji} [${geo.geo.countryData.name}]`
                terminalLines[trace.region][trace.hop + 1].textContent += ` ${whoisArray.join(" ")} `
                terminalLines[trace.region][trace.hop + 1].onclick = () => {
                  window.location.href = "https://atrqipagi3.execute-api.eu-west-3.amazonaws.com/dev/whois?ip=" + trace.ip
                }
              })
            }
          }
          // terminalLines[trace.region][trace.hop+1].textContent = lineContent
          // line.textContent = lineContent
        })

        lines.appendChild(line)
      }
    } catch (err) {
      // console.log("ERR", event, err)
    }
    // }
  })


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




  // get("https://utils.r3js.com/geo", 'get', speedEngine(totals, newCDN()))
  //   .then((result) => {
  //     console.log("💚 get got", result)
  //   })
}