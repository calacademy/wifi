#!/bin/sh

# push to s3
aws s3 sync --region us-west-2 "`dirname "$0"`" s3://wifi.calacademy.org --exclude=".*/*" --exclude="*.DS_Store" --delete

# cloudfront invalidate
aws cloudfront create-invalidation --region us-west-2 --distribution-id EQK4084546DXW --paths /\*
