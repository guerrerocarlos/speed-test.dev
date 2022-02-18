const config = {
  "service": "node-speed-test",
  "frameworkVersion": "3",
  "provider": {
    "name": "aws",
    "timeout": 900,
    "runtime": "nodejs12.x",
    "stage": "dev",
    "memorySize": 128,
    "region": "eu-west-3",
    "logs": {
      "websocket": true
    },
    "deploymentBucket": {
      "name": "deployment-bucket-eu-west-3"
    },
    'iam': {
      'role': {
        'statements': [
          {
            "Effect": "Allow",
            "Action": [
              "lambda:InvokeFunction"
            ],
            "Resource": "*"
          }
        ],
      },
    },
    'environment': {
      'FUNCTION_NAME': 'node-speed-test-dev-process',
      'AWS_REGION': 'eu-west-3'
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
  }
}


module.exports = config