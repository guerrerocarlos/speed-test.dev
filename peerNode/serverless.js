const config = {
  "service": "node-speed-test",
  "frameworkVersion": "3",
  "provider": {
    "name": "aws",
    "runtime": "nodejs12.x",
    "stage": "dev",
    "region": "eu-west-3",
    "logs": {
      "websocket": true
    },
    "deploymentBucket": {
      "name": "deployment-bucket-eu-west-3"
    },
  },
  "functions": {
    'process': {
      'handler': "index.init",
      'events': [
        {
          "http": {
            "path": "init",
            "method": "get"
          }
        }
      ]
    },
  },
}


module.exports = config