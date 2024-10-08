
function peerNode(SimplePeer, WebSocket, wrtc, html, opts) {

  const socket = new WebSocket('wss://ua7u2vwiqh.execute-api.eu-west-3.amazonaws.com/dev', [])

  let peers = {}

  // Connection opened
  socket.addEventListener('open', function (event) {
    console.log("INIT!")
    socket.send(JSON.stringify({ event: "init" }));
  });

  function cleanPeers() {
    let newPeers = {}
    for (let peerId in peers) {
      if (!peers[peerId].dead) {
        newPeers[peerId] = peers[peerId]
      } else {
        peers[peerId].delete()
      }
    }
    peers = newPeers
  }

  function Peer(socket, peerId, opts, html) {
    const sendQueue = []

    const peer = {
      id: peerId,
      dead: false,
      totalBufferReceivedCount: 0,
      totalBufferSentCount: 0,
      downloadSpeed: 0,
      downloadUnits: "Kbps",
      uploadSpeed: 0,
      uploadUnits: "Kbps",
      latency: "Init..",
      // updateUI: (peer) => {
      //   peer.uploadUnits = "Kbps"
      //   let received = peer.totalBufferReceivedCount * 8 / 1024
      //   if (received > 1024) {
      //     received = received / 1024
      //     peer.uploadUnits = "Mbps"
      //   }
      //   peer.uploadSpeed = limitNumber(received / (peer.uiUpdateInterval / 1000))
      //   peer.totalBufferReceivedCount = 0

      //   peer.downloadUnits = "Kbps"
      //   let sent = peer.totalBufferSentCount * 8 / 1024
      //   if (sent > 1024) {
      //     sent = sent / 1024
      //     peer.downloadUnits = "Mbps"
      //   }
      //   peer.downloadSpeed = limitNumber(sent / (peer.uiUpdateInterval / 1000))
      //   peer.totalBufferSentCount = 0

      //   // if (peer.html) peer.html.render(peer)
      // },
      startUpload: (token) => {
        if (myPeer.uploadToken == token) {
          // peer.speedInterval = setInterval(peer.sendBuffer, peer.uploadInterval)
          peer.sendBuffer()
          peer.sendBuffer()
          peer.sendBuffer()

          console.log("💚 SENT BUFFERS!")
          peer.sendingBuffers = true
        }
        // peer.speedUIInterval = setInterval(peer.updateUI, peer.uiUpdateInterval)
        // }
      },
      stopUpload: () => {
        console.log("🟥 STOP BUFFERS FROM:", peer.hashId)

        peer.sendingBuffers = false
        // clearInterval(peer.speedInterval)
        // clearInterval(peer.speedUIInterval)
      },
      uiUpdateInterval: generalUIUpdateInterval,
      speedInterval: null,
      uploadInterval: 333,
      bufferSize: 2000,
      increment: 2000,
      sendBuffer: () => {
        try {
          if (peer.bufferSize + peer.increment < 250000) {
            peer.bufferSize += peer.increment
          }
          let buffer = new ArrayBuffer(peer.bufferSize)
          // console.log("🌲 SEND to", peer.id, buffer)
          p.send(buffer)
          peer.totalBufferSentCount += peer.bufferSize
          myPeer.totalBufferSentCount += peer.bufferSize
        } catch (err) {
          console.log("sendBuffer err", err)
          peer.bufferSize -= peer.increment
        }
      },
      delete: () => {
        if (peer.html) peer.html.remove()
      },
      send: (event, data) => {
        let payload = { event, data }
        if (!peer.dead) {
          try {
            if (peer.connected) {
              // console.log(">> TO", peer.id, payload)
              p.send(JSON.stringify(payload))
            } else {
              // console.log("Queing message for", peerId, " => ", payload)
              // if (sendQueue.length > 100) {
              //   peer.dead = true
              //   cleanPeers()
              // }
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
      },
      startDownloadFromPeer: () => {
        console.log("start download!")
        peer.downloadStatus = true
        console.log("request download from", peer.hashId)
        peer.send("request", { execute: "startUpload", param: peer.uploadToken })
        peer.html.updateDownloadButton()
      },
      stopDownloadFromPeer: () => {
        console.log("stop download!")
        peer.downloadStatus = false
        console.log("request stop download from", peer.hashId)
        peer.send("request", { execute: "stopUpload" })
        peer.html.updateDownloadButton()
      },
      enableUpload: (extraPayload = {}) => {
        console.log("Give upload token to", { token: myPeer.uploadToken })
        peer.send("enableUpload", Object.assign({ token: myPeer.uploadToken }, extraPayload))
      },
      setNick: (data) => {
        console.log("Send nick", data)
        peer.send("setNick", data)
      }
    }

    const p = new SimplePeer({
      initiator: (opts && opts.receiver) ? false : true,
      // trickle: false,
      wrtc: wrtc
    })

    const isItDead = setTimeout(() => {
      peer.dead = true
      console.log("Considering", peerId, "as dead...")
    }, 20 * 1000)

    p.on('error', err => {
      peer.dead = true
      console.log('📍', peerId, 'error', err)
      peer.delete()
      cleanPeers()
    })

    p.on('signal', data => {
      if (html) peer.html = html.newPeer(peer)

      const payload = { event: "signal", toPeerId: peerId, data }
      // console.log('SEND SIGNAL', JSON.stringify(payload))
      console.log('SEND SIGNAL TO', peerId)
      socket.send(JSON.stringify(payload));
    })

    p.on('connect', () => {
      console.log('CONNECTED', peer.id)
      clearTimeout(isItDead)
      peer.connected = true

      if (opts && opts.nick) {
        console.log("😍 SEND NICK", opts.nick)
        // p.send(JSON.stringify({ event: "setNick", data: opts.nick }))
        peer.setNick({ nick: opts.nick })
      }

      if (opts && opts.autoEnableUpload) {
        peer.enableUpload({ isServer: true })
      }

      for (let payload of sendQueue) {
        console.log("📄 to", peer.peerId, payload)
        p.send(payload)
      }
      // if (myPeer.downloadStatus) {
      //   peer.startUpload()
      // }
    })

    p.on('data', async data => {
      try {
        let payload = JSON.parse(data.toString())
        // console.log(`<< ${peerId} `, data.toString())
        if (onCallbacks[payload.event || "default"]) {
          onCallbacks[payload.event || "default"](payload.data, peer)
        } else {
          console.log("Unknown", payload.event, "event received")
        }
      } catch (err) {
        // console.log("not json, must be speed buffer")
        onCallbacks["buffer"](data, peer)
      }
    })

    let onCallbacks = {
      setNick: (payload, peer) => {
        console.log("😂😂😂 GOT NICK!", payload)
        peer.nick = payload.nick
        if (peer.html) peer.html.updateNick()
      },
      request: (payload, peer) => {
        console.log("GOT REQUEST", payload)
        if (payload.execute) {
          console.log(`EXECUTING peer.${payload.execute}()`, peer[payload.execute])
          peer[payload.execute](payload.param)
        }
      },
      enableUpload: (payload, peer) => {
        console.log("GOT uploadToken for peer", payload)
        peer.uploadToken = payload.token
        peer.isServer = payload.isServer
      },
      bufferReceived: (payload, peer) => {
        if (peer.sendingBuffers) {
          peer.sendBuffer()
        }
      },
      buffer: (payload, peer) => {
        // console.log("🚚 got buffer", payload)
        console.log("🧡 GOT BUFFERS!")

        // if (peer.receivingBuffers) {
        peer.totalBufferReceivedCount += payload.length
        myPeer.totalBufferReceivedCount += payload.length
        peer.send('bufferReceived', { bufferReceivedLength: payload.length })
        // }
      },
      ping: (payload, peer) => {
        payload.pong = true
        peer.send("pong", payload)
      },
      pong: (payload, peer) => {
        // console.log("TOOK", new Date() - pings[payload], "miliseconds from", peer.id)
        // if (peer.html) {
        peer.latency = (new Date() - pings[payload]) + " ms"
        // peer.html.render(peer)
        delete pings[payload]
        // }
      },
      default: (payload, peer) => {
        console.log("GOT RAW", peer.id, payload)
      }
    }
    return peer
  }


  // let myPeerUI
  let myPeer = {
    id: null,
    uploadToken: Math.random(),
    nick: opts.myNick,
    downloadSpeed: 0,
    downloadUnits: "Kbps",
    uploadSpeed: 0,
    uploadUnits: "Kbps",
    totalBufferReceivedCount: 0,
    totalBufferSentCount: 0,
    uiUpdateInterval: generalUIUpdateInterval,
    maxDownloadSpeed: 0,
    maxUploadSpeed: 0,
    localhost: true,
    downloadStatus: false,
    latency: "-",
    startDownloadFromPeer: () => {
      console.log("start download!")
      myPeer.downloadStatus = true
      for (let peerId in peers) {
        peers[peerId].startDownloadFromPeer()
        // peers[peerId].downloadStatus = true
        // peers[peerId].html.updateDownloadButton()
      }
      myPeer.html.updateDownloadButton()
    },
    stopDownloadFromPeer: () => {
      console.log("stop download!")
      myPeer.downloadStatus = false
      for (let peerId in peers) {
        console.log("request stop download from", peers[peerId].hashId)
        // peers[peerId].downloadStatus = false

        peers[peerId].stopDownloadFromPeer()
        // peers[peerId].html.updateDownloadButton()
      }
      myPeer.html.updateDownloadButton()
    },
    setId: (peerId) => {
      console.log("SET ID!", peerId)
      myPeer.id = peerId
      if (myPeer.html) myPeer.html.setHashId()
    }
  }

  if (html) myPeer.html = html.newPeer(myPeer, { autoRender: myPeer.uiUpdateInterval })

  let inited

  socket.addEventListener('message', function (event) {
    // clearTimeout(tryAgainTimeout)
    let payload = JSON.parse(event.data)

    console.log("😎 MASTER>", JSON.stringify(payload, null, 2))

    if (payload.myId) {
      myPeer.setId(payload.myId)
    }

    if (payload.result) {
      console.log(payload.result)
    }

    if (payload.disconnectedPeerId) {
      console.log("Server said there was a peer down", payload.disconnectedPeerId)
      if (peers[payload.disconnectedPeerId]) {
        peers[payload.disconnectedPeerId].delete()
        delete peers[payload.disconnectedPeerId]
      }
    }

    if (payload.event === "signal") {
      // console.log("peers", peers)
      // console.log("💊 GOT SIGNAL", "from", payload.fromPeerId, "data:", peers[payload.fromPeerId])

      if (!peers[payload.fromPeerId]) {
        peers[payload.fromPeerId] = new Peer(socket, payload.fromPeerId, Object.assign(opts, { receiver: true }), html)
      }

      peers[payload.fromPeerId].signal(payload.data)
    }

    if (payload.peerIds && !inited) {
      inited = true
      for (let peerId of payload.peerIds) {
        peers[peerId] = new Peer(socket, peerId, opts, html)
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
  }, 1500)

  return myPeer

  // setInterval(() => {
  //   cleanPeers()
  //   let connectedPeersCount = 0
  //   for (let peerId in peers) {
  //     if (peers[peerId].connected) {
  //       connectedPeersCount++
  //     }
  //   }
  //   console.log(`[${myPeer.id}]::: Connected to`, Object.keys(peers).length, Object.keys(peers), `connected: ${connectedPeersCount}`)
  // }, 5000)
}

module.exports = peerNode