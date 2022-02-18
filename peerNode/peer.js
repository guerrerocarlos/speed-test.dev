
function peerNode(SimplePeer, WebSocket, wrtc, html) {
  const socket = new WebSocket('wss://ua7u2vwiqh.execute-api.eu-west-3.amazonaws.com/dev', [])

  let peers = {}
  let myId
  // Connection opened
  socket.addEventListener('open', function (event) {
    console.log("INIT!")
    socket.send(JSON.stringify({ event: "init" }));
    // socket.send(JSON.stringify({ event: "init" }));
  });

  function cleanPeers() {
    let newPeers = {}
    for (let peerId in peers) {
      if (!peers[peerId].dead) {
        newPeers[peerId] = peers[peerId]
      }
    }
    peers = newPeers
  }

  function Peer(socket, peerId, opts, html) {
    const sendQueue = []
    const listeners = []

    const p = new SimplePeer({
      initiator: (opts && opts.receiver) ? false : true,
      trickle: false,
      wrtc: wrtc
    })

    const isItDead = setTimeout(() => {
      peer.dead = true
      console.log("Considering", peerId, "as dead...")
    }, 60 * 1000)

    p.on('error', err => {
      peer.dead = true
      console.log('📍', peerId, 'error', err)
      cleanPeers()
    })

    p.on('signal', data => {
      const payload = { event: "signal", toPeerId: peerId, data }
      // console.log('SEND SIGNAL', JSON.stringify(payload))
      console.log('SEND SIGNAL TO', peerId)
      socket.send(JSON.stringify(payload));
    })

    p.on('connect', () => {
      console.log('CONNECTED')
      if(html) html.newPeer(peer.peerId)
      clearTimeout(isItDead)
      peer.connected = true
      for (let payload of sendQueue) {
        console.log("📄 to", peer.peerId, payload)
        p.send(payload)
      }
    })

    p.on('data', async data => {
      // console.log(`<< ${peerId} `, data.toString())
      let payload = JSON.parse(data.toString())
      onCallbacks[payload.event || "default"](payload.data, peer)
    })

    const peer = {
      id: peerId,
      dead: false,
      send: (event, data) => {
        let payload = { event, data }
        if (!peer.dead) {
          try {
            if (peer.connected) {
              // console.log(">> TO", peer.id, payload)
              p.send(JSON.stringify(payload))
            } else {
              // console.log("Queing message for", peerId, " => ", payload)
              if (sendQueue.length > 100) {
                peer.dead = true
                cleanPeers()
              }
              sendQueue.push(JSON.stringify(payload))
            }
          } catch (err) {
            peer.dead = true
            console.log(err)
            cleanPeers()
          }
        }
      },
      signal: (signal) => {
        // console.log("GOT SIGNAL FROM", peer.id)
        console.log("GOT SIGNAL", peer.id, signal)
        p.signal(signal)
      }
    }

    return peer
  }

  let onCallbacks = {
    ping: (payload, peer) => {
      payload.pong = true
      peer.send("pong", payload)
    },
    pong: (payload, peer) => {
      console.log("TOOK", new Date() - pings[payload], "miliseconds from", peer.id)
    },
    default: (payload, peer) => {
      console.log("GOT RAW", peer.id, payload)
    }
  }


  socket.addEventListener('message', function (event) {
    console.log('server$', event.data);
    let payload = JSON.parse(event.data)

    if (payload.myId) {
      myId = payload.myId
    }

    if (payload.result) {
      console.log(payload.result)
    }

    if (payload.disconnectedPeerId) {
      console.log("Server said there was a peer down", payload.disconnectedPeerId)
      delete peers[payload.disconnectedPeerId]
    }

    if (payload.event === "signal") {
      // console.log("peers", peers)
      // console.log("💊 GOT SIGNAL", "from", payload.fromPeerId, "data:", peers[payload.fromPeerId])

      if (!peers[payload.fromPeerId]) {
        peers[payload.fromPeerId] = new Peer(socket, payload.fromPeerId, { receiver: true }, html)
      }

      peers[payload.fromPeerId].signal(payload.data)
    }

    if (payload.peerIds) {
      for (let peerId of payload.peerIds) {
        peers[peerId] = new Peer(socket, peerId, {}, html)
      }
    }

  });

  const pings = {}
  setInterval(() => {
    for (let peerId in peers) {
      if (peers[peerId].connected) {
        let pingId = (Math.random() + 1).toString(36).substring(7);
        pings[pingId] = new Date()
        peers[peerId].send("ping", pingId)
      }
    }
  }, 1000)

  setInterval(() => {
    cleanPeers()
    let connectedPeersCount = 0
    for (let peerId in peers) {
      if (peers[peerId].connected) {
        connectedPeersCount++
      }
    }
    console.log(`[${myId}]::: Connected to`, Object.keys(peers).length, Object.keys(peers), `connected: ${connectedPeersCount}`)
  }, 10000)
}

module.exports = peerNode