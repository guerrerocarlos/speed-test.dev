var ws = new WebSocket("wss://kcb2ee9ega.execute-api.eu-west-3.amazonaws.com/prod");
ws.addEventListener('open', () => {
  console.log('WebSocket is open now.', WebSocket.extensions)
  ws.send(JSON.stringify({ status: "ok" }));
  ws.send(JSON.stringify({ traceroute: { region: 'us-east-1' } }));
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
  console.log('🍊 message', event)
  if (trace.region == 'us-east-1') {
    line = document.createElement('div')
    line.textContent = `${trace.rtt1} ${trace.ip}`
    lines.appendChild(line)
  }
})

const traceroutes = document.getElementById("traceroutes")
traceroutes.appendChild(lines)