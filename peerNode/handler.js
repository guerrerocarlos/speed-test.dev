const AWS = require('aws-sdk');
const whois = require('whois');
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
    let n = 2

    if (event.action === "run") {
      await new Promise((success) => {
        const peer1 = peerNode.main()
        const peer2 = peerNode.main()
        setTimeout(async () => {
          // peer.closeAll()
          success()
        }, 800 * 1000 )
      })
    } else {
      try {
        let invokationsPromises = []
        for (let i = 0; i < n; i++) {
          invokationsPromises.push(invokeLambda())
        }
        await Promise.all(invokationsPromises)
      } catch (err) {
        console.log(err)
      }
    }

    return {
      statusCode: 200,
      body: "INITED"
    }
  },
  whois: async (event) => {
    console.log(JSON.stringify(event, null, 2))
    let response = await new Promise((success) => {
      console.log("lookup for:", event.queryStringParameters.ip)
      console.log(whois.lookup(event.queryStringParameters.ip), function (err, response) {
        console.log(err, response)
        success(response)
      })
    })
    return {
      statusCode: 200,
      body: response
    }
  }
}
