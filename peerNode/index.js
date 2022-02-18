const {
  SimplePeer,
  WebSocket,
  wrtc
} = require("./server.js")
const peerNode = require("./peer.js")

module.exports = {
  init: (event) => {
    console.log("🚀", JSON.strigify(event, null, 2))

    peerNode(SimplePeer,
      WebSocket,
      wrtc)

    return {
      statusCode: 200,
      body: "INITED"
    }
  }
}

if (require.main === module) {
  peerNode(SimplePeer,
    WebSocket,
    wrtc)
}