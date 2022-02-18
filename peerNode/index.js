var AWS = require('aws-sdk');
AWS.config.region = process.ev.AWS_REGION;
var lambda = new AWS.Lambda();

const {
  SimplePeer,
  WebSocket,
  wrtc
} = require("./server.js")
const peerNode = require("./peer.js")

async function invokeLambda() {
  var params = {
    FunctionName: process.env.FUNCTION_NAME, // the lambda function we are going to invoke
    InvokeArgs: '{"action": "run"}'
  };

  await lambda.invokeAsync(params).promise
}

module.exports = {
  init: async (event) => {
    console.log("🚀", JSON.stringify(event, null, 2))

    if (event.action === "run") {
      peerNode(SimplePeer,
        WebSocket,
        wrtc)
    } else {
      invokeLambda()
    }

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