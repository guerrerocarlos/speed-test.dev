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
      'FUNCTION_NAME': 'node-speed-test-dev-process'
    },
  },
  "functions": {
    'process': {
      'handler': "handler.init",
      'events': [
        {
          "http": {
            "path": "init",
            "method": "get"
          }
        }
      ]
    },
    'whois': {
      'handler': "handler.whois",
      'events': [
        {
          "http": {
            "path": "whois",
            "method": "get"
          }
        }
      ]
    },
  }
}


module.exports = config