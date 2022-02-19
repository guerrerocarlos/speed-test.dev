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

    if (event.action === "run") {
      await new Promise(() => {
        peerNode.main()
      }) 
    } else {
      await invokeLambda()
    }

    return {
      statusCode: 200,
      body: "INITED"
    }
  }
}
