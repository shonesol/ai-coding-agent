#!/usr/bin/env bash
set -euo pipefail

echo "▶ Building frontend..."
npm run build

echo "▶ Deploying Firebase Hosting + Functions + Rules..."
firebase deploy

echo "✅ Deploy complete."
echo "   Hosting URL will be shown above."
