#!/usr/bin/env bash
# =============================================================================
#  setup-server.sh — One-shot bulletproof server bootstrap
#
#  USAGE (run on fresh Ubuntu 24.04 as root):
#    scp -r deploy/server-hardening root@SERVER:/root/setup
#    scp -r deploy/nginx             root@SERVER:/root/setup/nginx
#    ssh root@SERVER "bash /root/setup/setup-server.sh 2>&1 | tee /root/setup.log"
#
#  REQUIREMENTS before running:
#    1. Edit SERVER_IP below
#    2. Edit REPO_* vars to point at your Git repos
#    3. Add your public SSH key content in AUTHORIZED_KEY
#    4. Add your local IP(s) to FAIL2BAN_IGNORE_IPS
#    5. Populate .env files (see sections marked ENV_SETUP)
#
#  WHAT THIS DOES:
#    - System update + essential package install
#    - SSH hardening (key-only, MaxAuthTries 3)
#    - UFW firewall (deny-all default, allow 22/80/8090/8081/8082 only)
#    - fail2ban with aggressive SSH + nginx rules
#    - Install Docker, Node.js 20, PM2
#    - Clone + build both projects
#    - Configure nginx (copy your checked-in config)
#    - PM2 (admin-web + user-web) with startup hook
# =============================================================================
set -euo pipefail

# ── Configuration — edit before running ───────────────────────────────────────
SERVER_IP="46.224.231.217"   # public IP of the server
# Ports (must match nginx configs and UFW rules):
#   Portfolio  → http://SERVER_IP        (port 80)
#   API        → http://SERVER_IP:8090
#   Admin      → http://SERVER_IP:8081
#   User site  → http://SERVER_IP:8082

REPO_PORTFOLIO="https://github.com/aleksicdacha/portfolio.git"
REPO_REALESTATE="https://github.com/aleksicdacha/RealEstatesAPI-NestJS.git"

# GitHub Personal Access Token (needed if repos are private)
# Create at: https://github.com/settings/tokens  (scope: repo)
# Leave empty if repos are public
GITHUB_TOKEN="ghp_REPLACE_WITH_YOUR_GITHUB_PAT"

PORTFOLIO_DIR="/root/Portfolio"
REALESTATE_DIR="/root/RealEstatesAPI-NestJS"

# Your LOCAL public IP(s) — find with: curl https://ifconfig.me
FAIL2BAN_IGNORE_IPS="127.0.0.1/8 ::1 188.120.106.190"           # add your home IP after ::1

# The public SSH key to put in authorized_keys
AUTHORIZED_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIJGABygPNQOny8I2JbBchIdtsft4BYRw8/LGZ0J4qnL hetzner-root"   # paste 'ssh-ed25519 AAAA... comment' here

# Script directory (where you scp'd the files)
SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Colors ─────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
die()     { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# =============================================================================
# 0. PRE-FLIGHT CHECKS
# =============================================================================
[[ $EUID -ne 0 ]] && die "Must run as root"
[[ -z "$AUTHORIZED_KEY" ]] && die "Set AUTHORIZED_KEY before running"

info "Server setup starting — $(date '+%Y-%m-%d %H:%M:%S')"

# =============================================================================
# 1. SYSTEM UPDATE
# =============================================================================
info "1/11  Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
    curl wget git rsync unzip \
    software-properties-common \
    apt-transport-https ca-certificates gnupg \
    ufw fail2ban \
    nginx \
    build-essential
success "System updated"

# =============================================================================
# 2. SSH HARDENING
# =============================================================================
info "2/11  Hardening SSH..."

# Ensure our key is in authorized_keys BEFORE we turn off passwords
mkdir -p /root/.ssh
chmod 700 /root/.ssh
echo "$AUTHORIZED_KEY" >> /root/.ssh/authorized_keys
sort -u /root/.ssh/authorized_keys -o /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
success "Authorized key installed"

# Copy hardening drop-in config
if [[ -f "$SETUP_DIR/sshd_hardened.conf" ]]; then
    cp "$SETUP_DIR/sshd_hardened.conf" /etc/ssh/sshd_config.d/hardened.conf
    chmod 644 /etc/ssh/sshd_config.d/hardened.conf
    # Test config before applying
    sshd -t || die "sshd config test failed — check /etc/ssh/sshd_config.d/hardened.conf"
    systemctl reload ssh
    success "SSH hardened (password auth disabled)"
else
    warn "sshd_hardened.conf not found in $SETUP_DIR — skipping SSH hardening (DANGEROUS)"
fi

# =============================================================================
# 3. FIREWALL (UFW)
# =============================================================================
info "3/11  Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    comment 'SSH'
ufw allow 80/tcp    comment 'Portfolio'
ufw allow 8090/tcp  comment 'Real Estates API'
ufw allow 8081/tcp  comment 'Real Estates Admin'
ufw allow 8082/tcp  comment 'Real Estates User'
ufw --force enable
ufw status verbose
success "UFW enabled (deny-all + SSH/Portfolio/API ports)"

# =============================================================================
# 4. FAIL2BAN
# =============================================================================
info "4/11  Configuring fail2ban..."
if [[ -f "$SETUP_DIR/fail2ban-jail.local" ]]; then
    cp "$SETUP_DIR/fail2ban-jail.local" /etc/fail2ban/jail.local
    # Inject dynamic ignore IPs
    sed -i "s|^ignoreip = .*|ignoreip = $FAIL2BAN_IGNORE_IPS|" /etc/fail2ban/jail.local
    chmod 644 /etc/fail2ban/jail.local
    systemctl enable fail2ban
    systemctl restart fail2ban
    sleep 2
    fail2ban-client status || warn "fail2ban status check failed"
    success "fail2ban configured"
else
    warn "fail2ban-jail.local not found — using OS defaults"
    systemctl enable fail2ban
    systemctl restart fail2ban
fi

# =============================================================================
# 5. DOCKER
# =============================================================================
info "5/11  Installing Docker..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
        https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    success "Docker installed"
else
    success "Docker already installed ($(docker --version))"
fi

# =============================================================================
# 6. NODE.JS 20 + PM2
# =============================================================================
info "6/11  Installing Node.js 20 + PM2..."
if ! command -v node &>/dev/null || [[ "$(node -e 'process.exit(parseInt(process.version.slice(1)))')" -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
    success "Node.js $(node --version) installed"
else
    success "Node.js already installed ($(node --version))"
fi

npm install -g pm2 --silent
success "PM2 $(pm2 --version) installed"

# =============================================================================
# 7. CLONE REPOS
# =============================================================================
info "7/11  Cloning repositories..."

clone_or_pull() {
    local repo=$1 dir=$2 branch=${3:-}
    # Inject token into HTTPS URL if provided
    if [[ -n "$GITHUB_TOKEN" ]]; then
        repo="${repo/https:\/\//https:\/\/${GITHUB_TOKEN}@}"
    fi
    if [[ -d "$dir/.git" ]]; then
        info "  $dir exists — pulling latest..."
        git -C "$dir" remote set-url origin "$repo"
        [[ -n "$branch" ]] && git -C "$dir" checkout "$branch"
        git -C "$dir" pull --ff-only
    else
        git clone "$repo" "$dir"
        [[ -n "$branch" ]] && git -C "$dir" checkout "$branch"
    fi
    # Remove token from stored remote URL (don't persist token in .git/config)
    if [[ -n "$GITHUB_TOKEN" ]]; then
        local clean_repo="${repo//${GITHUB_TOKEN}@/}"
        git -C "$dir" remote set-url origin "$clean_repo"
    fi
}

clone_or_pull "$REPO_PORTFOLIO"   "$PORTFOLIO_DIR"
clone_or_pull "$REPO_REALESTATE"  "$REALESTATE_DIR"  "feature_revert"
success "Repos cloned"

# =============================================================================
# 8. NGINX
# =============================================================================
info "8/11  Configuring nginx..."

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Copy our config files
if [[ -d "$SETUP_DIR/nginx" ]]; then
    cp "$SETUP_DIR/nginx/nginx.conf"                                /etc/nginx/nginx.conf
    cp -r "$SETUP_DIR/nginx/conf.d/"*                               /etc/nginx/conf.d/  2>/dev/null || true
    mkdir -p /etc/nginx/snippets /etc/nginx/sites-available /etc/nginx/sites-enabled
    cp -r "$SETUP_DIR/nginx/snippets/"*                             /etc/nginx/snippets/
    cp "$SETUP_DIR/nginx/sites-available/portfolio.conf"            /etc/nginx/sites-available/portfolio.conf
    cp "$SETUP_DIR/nginx/sites-available/realestate.conf"           /etc/nginx/sites-available/realestate.conf

    # Substitute actual domain names
    ln -sf /etc/nginx/sites-available/portfolio.conf  /etc/nginx/sites-enabled/portfolio.conf
    ln -sf /etc/nginx/sites-available/realestate.conf /etc/nginx/sites-enabled/realestate.conf

    # Test nginx config before reloading
    nginx -t || die "nginx config test failed"
    systemctl reload nginx
    success "nginx configured"
else
    warn "nginx config dir not found at $SETUP_DIR/nginx — manual nginx setup needed"
fi

# =============================================================================
# 9. REAL ESTATES — ENV + DOCKER
# =============================================================================
info "9/11  Setting up Real Estates API (Docker)..."

RE_ENV="$REALESTATE_DIR/apps/api/.env"
if [[ ! -f "$RE_ENV" ]]; then
    warn "Missing $RE_ENV — creating template. FILL IT IN before services start."
    mkdir -p "$(dirname "$RE_ENV")"
    cat > "$RE_ENV" <<ENVTEMPLATE
# !! FILL IN ALL THESE VALUES !!
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_NAME=estates
JWT_SECRET=CHANGE_ME_AT_LEAST_32_CHARACTERS_LONG
NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://$SERVER_IP:8081,http://$SERVER_IP:8082
GEMINI_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ENVTEMPLATE
    die "Created env template at $RE_ENV — fill it in and re-run"
fi

# Fix PostgreSQL port binding (security) — bind only to loopback
COMPOSE_FILE="$REALESTATE_DIR/docker-compose.prod.yml"
if grep -q '"5432:5432"' "$COMPOSE_FILE"; then
    sed -i 's/"5432:5432"/"127.0.0.1:5432:5432"/g' "$COMPOSE_FILE"
    success "PostgreSQL port binding fixed (127.0.0.1 only)"
fi

# Same for Redis
if grep -q '"6379:6379"' "$COMPOSE_FILE"; then
    sed -i 's/"6379:6379"/"127.0.0.1:6379:6379"/g' "$COMPOSE_FILE"
    success "Redis port binding fixed (127.0.0.1 only)"
fi

cd "$REALESTATE_DIR"
docker compose -f docker-compose.prod.yml pull --quiet
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# Wait for Postgres to be healthy
info "  Waiting for postgres to be healthy..."
for i in $(seq 1 30); do
    if docker compose -f docker-compose.prod.yml exec -T postgres \
        pg_isready -U postgres &>/dev/null; then
        success "  Postgres healthy after $i seconds"
        break
    fi
    sleep 1
done

# Run migrations
docker compose -f docker-compose.prod.yml exec -T api \
    npx typeorm migration:run -d dist/data-source.js \
    || warn "Migrations failed — may need to run manually"

success "Docker services running"

# =============================================================================
# 11. REAL ESTATES — NEXT.JS APPS (PM2)
# =============================================================================
info "10/11  Building and starting Next.js apps..."

# Admin env
ADMIN_ENV="$REALESTATE_DIR/apps/admin-web/.env.local"
if [[ ! -f "$ADMIN_ENV" ]]; then
    cat > "$ADMIN_ENV" <<ADMINENV
NEXT_PUBLIC_API_URL=http://$SERVER_IP:8090/v1
ADMINENV
    warn "Created $ADMIN_ENV — verify NEXT_PUBLIC_API_URL is correct"
fi

# User env
USER_ENV="$REALESTATE_DIR/apps/user-web/.env.local"
if [[ ! -f "$USER_ENV" ]]; then
    cat > "$USER_ENV" <<USERENV
NEXT_PUBLIC_API_URL=http://$SERVER_IP:8090/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=CHANGE_ME
USERENV
    warn "Created $USER_ENV — fill in Google Maps API key"
fi

cd "$REALESTATE_DIR"
npm ci --silent
npm run build --workspace=apps/admin-web
npm run build --workspace=apps/user-web

# Start/restart with PM2
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

# Register PM2 to start on reboot
pm2 startup systemd -u root --hp /root | tail -1 | bash || \
    warn "PM2 startup registration failed — run 'pm2 startup' manually"

success "PM2 apps started"

# =============================================================================
# 12. PORTFOLIO DEPLOY
# =============================================================================
info "11/11  Deploying Portfolio (Angular SPA)..."

cd "$PORTFOLIO_DIR"

# Build
npm ci --silent
npm run build --configuration=production

# Allow nginx (www-data) to read files under /root
chmod 755 /root
chmod -R o+rX "$PORTFOLIO_DIR/dist/portfolio/browser"

# Nginx serves from /root/Portfolio/dist/portfolio/browser
# (already configured in portfolio.conf)
systemctl reload nginx
success "Portfolio deployed"

# =============================================================================
# FINAL STATUS
# =============================================================================
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  SERVER SETUP COMPLETE${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Services:"
docker compose -f "$REALESTATE_DIR/docker-compose.prod.yml" ps
echo ""
pm2 list
echo ""
echo "Firewall:"
ufw status numbered
echo ""
echo "Fail2ban:"
fail2ban-client status
echo ""
echo "nginx:"
nginx -t && echo "  config OK"
echo ""
echo -e "${YELLOW}CHECKLIST — verify these manually:${NC}"
echo "  [ ] $RE_ENV has real DB credentials"
echo "  [ ] $USER_ENV has Google Maps API key"
echo "  [ ] fail2ban-jail.local has your home IP in ignoreip"
echo "  [ ] Test SSH key login from new terminal BEFORE closing this session"
echo ""
echo -e "${CYAN}Access URLs:${NC}"
echo "  Portfolio  → http://$SERVER_IP"
echo "  API        → http://$SERVER_IP:8090/v1"
echo "  Admin      → http://$SERVER_IP:8081"
echo "  User site  → http://$SERVER_IP:8082"
echo ""
echo -e "${CYAN}Logs: /root/setup.log${NC}"
