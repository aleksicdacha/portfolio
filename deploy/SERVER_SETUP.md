# Hetzner Server — One-Time Setup Guide

Server: **realestates-production** · `46.224.231.217`

---

## STEP 1 — Generate a dedicated deploy SSH key (on your LOCAL machine)

```bash
ssh-keygen -t ed25519 -C "github-actions-portfolio-deploy" -f ~/.ssh/github_deploy_portfolio
# Press Enter twice (no passphrase — Actions runs unattended)
```

This creates two files:
- `~/.ssh/github_deploy_portfolio`       ← **private key** (goes to GitHub)
- `~/.ssh/github_deploy_portfolio.pub`   ← **public key** (goes to server)

---

## STEP 2 — Add public key to the Hetzner server

```bash
ssh-copy-id -i ~/.ssh/github_deploy_portfolio.pub root@46.224.231.217
# OR manually:
cat ~/.ssh/github_deploy_portfolio.pub | ssh root@46.224.231.217 "cat >> ~/.ssh/authorized_keys"
```

---

## STEP 3 — Add secrets to GitHub repository

Go to: **GitHub → aleksicdacha/portfolio → Settings → Secrets and variables → Actions → New repository secret**

| Secret name              | Value                                               |
|--------------------------|-----------------------------------------------------|
| `HETZNER_SSH_PRIVATE_KEY`| Full contents of `~/.ssh/github_deploy_portfolio`   |
| `HETZNER_HOST`           | `46.224.231.217`                                    |
| `HETZNER_USER`           | `root`                                              |

To copy the private key:
```bash
cat ~/.ssh/github_deploy_portfolio
# Copy the ENTIRE output including -----BEGIN/END----- lines
```

---

## STEP 4 — Hetzner Cloud Firewall

In **Hetzner Cloud Console → Firewalls → portfolio-firewall → Edit → Inbound rules**, ensure these ports are open:

| Protocol | Port  | Description                      |
|----------|-------|----------------------------------|
| TCP      | 22    | SSH (deploy + your own access)   |
| TCP      | 80    | HTTP → HTTPS redirect (portfolio)|
| TCP      | 443   | HTTPS portfolio                  |
| TCP      | 8090  | NestJS API HTTP (IP mode)        |
| TCP      | 8443  | HTTPS — NestJS API               |
| TCP      | 8081  | HTTP → HTTPS redirect (admin)    |
| TCP      | 8444  | HTTPS — Admin panel              |
| TCP      | 8082  | HTTP → HTTPS redirect (user site)|
| TCP      | 8445  | HTTPS — User website             |

---

## STEP 5 — First-time server software setup (run once via SSH)

```bash
ssh root@46.224.231.217

# Update system
apt update && apt upgrade -y

# Install nginx, certbot, rsync
apt install -y nginx certbot python3-certbot-nginx rsync

# Install Node.js 20 (for PM2 + monorepo apps)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

# Create portfolio web root
mkdir -p /root/Portfolio

# Create certbot webroot
mkdir -p /var/www/certbot
```

---

## STEP 6 — Install nginx config files (run once)

From your **local machine**:

```bash
# Upload nginx configs  (-O flag required: server has SFTP subsystem disabled)
scp -O deploy/nginx/nginx.conf                         root@46.224.231.217:/etc/nginx/nginx.conf
scp -O deploy/nginx/conf.d/rate-limiting.conf          root@46.224.231.217:/etc/nginx/conf.d/rate-limiting.conf
scp -O deploy/nginx/snippets/ssl-params.conf           root@46.224.231.217:/etc/nginx/snippets/ssl-params.conf
scp -O deploy/nginx/snippets/security-headers.conf     root@46.224.231.217:/etc/nginx/snippets/security-headers.conf
scp -O deploy/nginx/sites-available/portfolio.conf     root@46.224.231.217:/etc/nginx/sites-available/portfolio.conf
scp -O deploy/nginx/sites-available/realestate.conf    root@46.224.231.217:/etc/nginx/sites-available/realestate.conf

# Enable sites — ⚠️ Run this ONLY after the TLS certificate exists (Step 8)
# ssh root@46.224.231.217 "
#   rm -f /etc/nginx/sites-enabled/default
#   ln -sf /etc/nginx/sites-available/portfolio.conf   /etc/nginx/sites-enabled/portfolio.conf
#   ln -sf /etc/nginx/sites-available/realestate.conf  /etc/nginx/sites-enabled/realestate.conf
#   nginx -t && systemctl reload nginx
# "
```

---

## STEP 7 — Point DNS to your server ⚠️ DO THIS FIRST

Log in to your domain registrar (wherever `aleksicdacha.dev` is registered) and add/update:

| Type | Name              | Value             | TTL  |
|------|-------------------|-------------------|------|
| A    | `aleksicdacha.dev`     | `46.224.231.217`  | 300  |
| A    | `www.aleksicdacha.dev` | `46.224.231.217`  | 300  |

Then wait for DNS to propagate (usually 5–30 minutes). Verify:

```bash
# From your local machine:
dig aleksicdacha.dev +short
# Must return: 46.224.231.217
```

DNS not set up yet = Let's Encrypt certificate will fail.

---

## STEP 8 — Issue TLS certificate (Let's Encrypt)

Run **after DNS is confirmed pointing to the server**:

```bash
ssh root@46.224.231.217

# Stop nginx to free port 80 for certbot standalone mode
systemctl stop nginx

# Issue certificate
certbot certonly --standalone \
  -d aleksicdacha.dev -d www.aleksicdacha.dev \
  --non-interactive --agree-tos \
  --email your@email.com

# Enable our site configs (they reference the cert that now exists)
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/portfolio.conf  /etc/nginx/sites-enabled/portfolio.conf
ln -sf /etc/nginx/sites-available/realestate.conf /etc/nginx/sites-enabled/realestate.conf

# Test and start
nginx -t && systemctl start nginx

# Verify auto-renewal
systemctl status certbot.timer
certbot renew --dry-run
```

---

## STEP 9 — First manual deploy (to seed the Portfolio folder)

From your **local machine**:

```bash
npm run build:prod
rsync -azv --delete dist/portfolio/browser/ root@46.224.231.217:/root/Portfolio/
ssh root@46.224.231.217 "nginx -t && systemctl reload nginx"
```

After this, every `git push origin master` will trigger the GitHub Actions workflow automatically.

---

## Ongoing: deploy the Real-Estate monorepo (when you're ready)

```bash
ssh root@46.224.231.217

cd /root/RealEstatesAPI-NestJS
git clone https://github.com/aleksicdacha/RealEstatesAPI-NestJS.git .

# Create production env file
cp .env.production.template .env.production
# Edit .env.production with real values (DB passwords, JWT secrets, etc.)

npm ci
npm run build   # turbo builds all 3 apps

# Start all 3 processes under PM2
pm2 start apps/api/dist/main.js                           --name realestate-api
pm2 start "npm run start --prefix apps/admin-web"         --name realestate-admin
pm2 start "npm run start --prefix apps/user-web"          --name realestate-user
pm2 startup && pm2 save   # survive reboots

# Docker for PostgreSQL + Redis
docker compose up -d
```

---

## Verify everything is working

```bash
# nginx status
systemctl status nginx

# PM2 processes
pm2 status

# Test endpoints
curl -I https://aleksicdacha.dev                    # portfolio
curl https://aleksicdacha.dev:8443/v1/properties/public  # API

# nginx logs
tail -f /var/log/nginx/portfolio_access.log
tail -f /var/log/nginx/realestate_api_error.log
```
