### Distribute Ami

The idea of this project is to copy your image through all public regions.

Regions are static to avoid an api call to describe-regions, because AWS Lambda charges every 100ms.

Execute the following steps to package/deploy your SAM Template

1. $ aws cloudformation package --template-file template.yaml --s3-bucket <YOUR_BUCKET_NAME> --output-template-file packaged-template.yaml
2. $ aws cloudformation deploy --template-file packaged-template.yaml --stack-name distribute-ami-stack --region us-east-1 --capabilities CAPABILITY_IAM
3. check your aws console and identify your API Gateway endpoint
4. $ curl -XPOST -H "Content-Type: application/json" -d '{"imageId":"your-ami-id"}' https://your-endpoint.us-east-1.amazonaws.com/Prod/ami --max-time 10