## AWS-SAM-Express

A simple demo to show the integration of AWS Serverless Application Model (SAM) and an NodeJS Express application,
that will deploy to an API gateway and Lambda.

## Setup

### Install Python 2.7x

Check if you already have Python and its version:
```bash
which python && python --version
```

If you get version `2.7` or `3.6`, you are already set. If you don't have these versions installed, or if you want to set up a virtualenv (recommended),
install [pyenv](https://github.com/pyenv/pyenv-installer) or use [brew installer on MacOS] (https://github.com/pyenv/pyenv#homebrew-on-mac-os-x). Then, open a terminal and install Python:
```bash
pyenv install 2.7.14
```
(this will take some time)

#### virtualenv
```bash
pyenv virtualenv 2.7.14 aws-sam-express
```

#### Activate virtualenv
```bash
pyenv activate aws-sam-express
echo aws-sam-express > .python-version
```

### SAM

Install ``docker``, and then [sam-cli](https://github.com/awslabs/aws-sam-cli):
```
pip install aws-sam-cli
```

- [Docker needs to be setup separately](https://www.docker.com/community-edition)
- [NodeJS 8.10+ installed](https://nodejs.org/en/download/)

### App Dependencies

```bash
npm install
```

### Local development

**Invoking function locally through local API Gateway**

```bash
sam local start-api
```

If the previous command ran successfully you should now be able to hit the following local endpoint to invoke your function `http://localhost:3000/`. _The first time this request is made, it will download the Docker image, which may take a long time. Even when this is done, subsequent requests will check if this is the latest. After the initial request, for faster testing, append --skip-pull-image to the start-api call_:
```bash
sam local start-api --skip-pull-image
```

```bash
curl -v http://localhost:3000/
curl -v http://localhost:3000/users
curl -v http://localhost:3000/users/1/events -d '{"foo": {"bar": "quux"}}' -H 'Content-Type: application/json'
```

## AWS

### Requirements

* AWS CLI already configured with at least PowerUser permission

### Packaging and deployment

Firstly, we need a `S3 bucket` where we can upload our Lambda functions packaged as ZIP before we deploy anything - If you don't have a S3 bucket to store code artifacts then this is a good time to create one:

```bash
aws s3 mb s3://BUCKET_NAME
```

Next, run the following command to package our Lambda function to S3:

```bash
sam package \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket REPLACE_THIS_WITH_YOUR_S3_BUCKET_NAME
```

Next, the following command will create a Cloudformation Stack and deploy your SAM resources.

```bash
sam deploy \
    --template-file packaged.yaml \
    --stack-name sam-app \
    --capabilities CAPABILITY_IAM
```

> **See [Serverless Application Model (SAM) HOWTO Guide](https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md) for more details in how to get started.**

After deployment is complete you can run the following command to retrieve the API Gateway Endpoint URL:

```bash
aws cloudformation describe-stacks \
    --stack-name sam-app \
    --query 'Stacks[].Outputs'
```

## Appendix

### AWS CLI commands

AWS CLI commands to package, deploy and describe outputs defined within the cloudformation stack:

```bash
sam package \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket REPLACE_THIS_WITH_YOUR_S3_BUCKET_NAME

sam deploy \
    --template-file packaged.yaml \
    --stack-name sam-app \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides MyParameterSample=MySampleValue

aws cloudformation describe-stacks \
    --stack-name sam-app --query 'Stacks[].Outputs'
```

**NOTE**: Alternatively this could be part of package.json scripts section.

* [AWS Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/)
