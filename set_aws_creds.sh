#!/bin/bash

environment=$1

if [[ -z "$environment" ]]; then
  echo "No environment specified, usage: ./set_aws_creds.sh [production|staging]" >&2
  exit 1
fi

if [[ "$environment" != "staging" ]] && [[ "$environment" != "production" ]]; then
    echo "Option $environment is not a valid value" >&2
    exit 1
fi

if [[ -z "$EXTERNAL_ID" ]]; then
  echo "EXTERNAL_ID must be set" >&2
  exit 1
fi

echo "Attempting to obtain temp AWS creds for $environment"

if [[ "$environment" == "staging" ]]; then
    if [[ -z "$PROD_ACCESS_KEY_ID" ]] || [[ -z "$PROD_SECRET_ACCESS_KEY" ]] || [[ -z "$PROD_ROLE_ARN" ]]; then
        echo "DEV_ACCESS_KEY_ID, DEV_SECRET_ACCESS_KEY, and DEV_ROLE_ARN must be set for staging" >&2
        exit 1
    fi
    export AWS_ACCESS_KEY_ID=$PROD_ACCESS_KEY_ID && export AWS_SECRET_ACCESS_KEY=$PROD_SECRET_ACCESS_KEY
    aws_credentials=$(aws --region us-east-1 sts assume-role --role-arn ${PROD_ROLE_ARN} --role-session-name "lo-portal" --external-id ${EXTERNAL_ID} --output json)
fi

if [[ "$environment" == "production" ]]; then
    if [[ -z "$PROD_ACCESS_KEY_ID" ]] || [[ -z "$PROD_SECRET_ACCESS_KEY" ]] || [[ -z "$PROD_ROLE_ARN" ]]; then
        echo "PROD_ACCESS_KEY_ID, PROD_SECRET_ACCESS_KEY, and PROD_ROLE_ARN must be set for production" >&2
        exit 1
    fi
    export AWS_ACCESS_KEY_ID=$PROD_ACCESS_KEY_ID && export AWS_SECRET_ACCESS_KEY=$PROD_SECRET_ACCESS_KEY
    aws_credentials=$(aws --region us-east-1 sts assume-role --role-arn ${PROD_ROLE_ARN} --role-session-name "lo-portal" --external-id ${EXTERNAL_ID} --output json)           
fi

export AWS_ACCESS_KEY_ID=$(echo $aws_credentials|jq '.Credentials.AccessKeyId'|tr -d '"')
export AWS_SECRET_ACCESS_KEY=$(echo $aws_credentials|jq '.Credentials.SecretAccessKey'|tr -d '"')
export AWS_SESSION_TOKEN=$(echo $aws_credentials|jq '.Credentials.SessionToken'|tr -d '"')
echo "ACCESS KEY: $PROD_ACCESS_KEY_ID"

echo "AWS creds set for $environment"