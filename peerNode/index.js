const {
  SimplePeer,
  WebSocket,
  wrtc
} = require("./server.js")
const peerNode = require("./peer.js")

module.exports = {
  main: (opts) => {
    peerNode(SimplePeer,
      WebSocket,
      wrtc, null, {
        nick: `AWS Lambda ${process.env.AWS_REGION || "local"}`
      })
  }
}
process.env.HEADLESS = true 
if (require.main === module) {
  module.exports.main()
}