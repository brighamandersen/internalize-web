#!/bin/bash
set -euo pipefail

echo "Deploying internalize-web"

# nginx

sudo cp /home/brig/dev/internalize-web/deploy/nginx.conf /etc/nginx/conf.d/internalize-web.conf

sudo nginx -t
sudo systemctl reload nginx

echo "Deployment complete for internalize-web"
