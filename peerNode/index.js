const {
  SimplePeer,
  WebSocket,
  wrtc
} = require("./server.js")
const peerNode = require("./peer.js")

module.exports = {
  main: () => {
    peerNode(SimplePeer,
      WebSocket,
      wrtc)
  }
}
process.env.HEADLESS = true 
if (require.main === module) {
  module.exports.main()
}