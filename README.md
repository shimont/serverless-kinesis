# AWS Serverless Kinesis KCL Template

This project is based on the [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model) and the [Kinesis-Aggregation](https://github.com/awslabs/kinesis-aggregation) repo by AWS. You can use this teamplte in order to process Kinesis [KCL](https://github.com/awslabs/amazon-kinesis-producer) records via AWS Lambda / Kinesis Firehose.
## Installation
```bash
$ npm install
```
## Deployment
You need to have the [AWS CLI](https://aws.amazon.com/cli/) tools installed and in your PATH.

```bash
$ ./scripts/build.sh
```

