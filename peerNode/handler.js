const AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION;
const lambda = new AWS.Lambda();
const peerNode = require("./")

async function invokeLambda() {
  var params = {
    FunctionName: process.env.FUNCTION_NAME, // the lambda function we are going to invoke
    InvokeArgs: '{"action": "run"}'
  };
  console.log("invoke!", params)
  let result = await lambda.invokeAsync(params).promise()
  console.log(result)
}

module.exports = {
  init: async (event, ctx) => {
    ctx.callbackWaitsForEmptyEventLoop = true
    console.log("🚀", JSON.stringify(event, null, 2))
    let n = 10

    if (event.action === "run") {
      await new Promise((success) => {
        const peer = peerNode.main()
        setTimeout(async () => {
          // peer.closeAll()
          success()
        }, 800 * 1000 )
      })
    } else {
      let invokationsPromises = []
      for (let i = 0; i < n; i++) {
        invokationsPromises.push(invokeLambda())
      }
      await Promise.all(invokationsPromises)
    }

    return {
      statusCode: 200,
      body: "INITED"
    }
  }
}
