#!/bin/bash
echo "[1/4] Setting up build resources..."
rm -rf build
mkdir build
echo "[2/4] Packaging code..."
aws cloudformation package --template-file template.yaml --s3-bucket shimont-sam --output-template-file build/output.yaml
echo "[3/4] Deploying code..."
aws cloudformation deploy --template-file build/output.yaml --stack-name shimont-sam-dev --capabilities CAPABILITY_IAM
echo "[4/4] Cleaning up..."
rm -rf output.yaml
rm -rf build