const AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION;
const lambda = new AWS.Lambda();
const main = require("./") 

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
      main()
    } else {
      invokeLambda()
    }

    return {
      statusCode: 200,
      body: "INITED"
    }
  }
}
