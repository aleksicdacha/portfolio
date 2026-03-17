#!/usr/bin/env bash
# =============================================================================
#  deploy/deploy.sh — Build & deploy portfolio to Hetzner
#
#  Server:  realestates-production
#  IPv4:    46.224.231.217
#  IPv6:    2a01:4f8:1c1f:9e37::/64
#
#  Usage:   ./deploy/deploy.sh <ssh-user>
#  Example: ./deploy/deploy.sh root
#
#  !! DO NOT run without explicit permission !!
# =============================================================================
set -euo pipefail

USER="${1:?Usage: ./deploy/deploy.sh <ssh-user>}"
SERVER="46.224.231.217"
REMOTE="$USER@$SERVER"
REMOTE_DIR="/root/Portfolio"

echo "▶  Building production bundle..."
npm run build

echo "▶  Deploying to $REMOTE:$REMOTE_DIR ..."
rsync -avz --delete \
  --exclude=".git" \
  dist/portfolio/browser/ \
  "$REMOTE:$REMOTE_DIR/"

echo "▶  Reloading nginx..."
ssh "$REMOTE" "nginx -t && systemctl reload nginx"

echo "✔  Done — https://aleksicdacha.dev"

# ── To deploy the Real-Estate monorepo (3 apps) — SSH in and do: ─────────────
# ssh $REMOTE "
#   cd /root/RealEstatesAPI-NestJS
#   git pull
#   npm ci
#   npm run build                               # turbo builds all 3 apps
#   pm2 reload realestate-api || pm2 start apps/api/dist/main.js --name realestate-api
#   pm2 reload realestate-admin || pm2 start 'npm run start --prefix apps/admin-web' --name realestate-admin
#   pm2 reload realestate-user  || pm2 start 'npm run start --prefix apps/user-web'  --name realestate-user
#   pm2 save
# "
#
# Hetzner firewall — required open ports for all 3 apps:
#   TCP 8080 (API HTTP→HTTPS redirect)
#   TCP 8443 (API HTTPS)
#   TCP 8081 (Admin HTTP→HTTPS redirect)
#   TCP 8444 (Admin HTTPS)
#   TCP 8082 (User site HTTP→HTTPS redirect)
#   TCP 8445 (User site HTTPS)
