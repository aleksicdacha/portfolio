#!/usr/bin/env bash
# =============================================================================
#  deploy-playbook.sh — Complete deploy, GitHub setup & verification playbook
#
#  Covers both projects on the single Hetzner server (46.224.231.217):
#    - aleksicdacha/portfolio          (Angular SPA)
#    - aleksicdacha/RealEstatesAPI-NestJS (NestJS API + Admin + User Next.js)
#
#  USAGE:
#    ./deploy/deploy-playbook.sh <phase>
#
#  PHASES:
#    github-setup       Print GitHub Secrets + security features checklist
#    server-bootstrap   One-time server setup (fresh machine only)
#    deploy-portfolio   Build + rsync Angular to server, reload nginx
#    deploy-nginx       Sync nginx configs to server, test + reload
#    deploy-realestate  Manual deploy (push to master triggers auto via Actions)
#    run-migrations     Run TypeORM migrations inside the API Docker container
#    test               Run all verification tests against the live server
#    test-headers       Test HTTP security headers only
#    test-ratelimit     Test rate limiting + brute-force protection only
#    test-auth          Test auth endpoint security only
#    test-health        Test all app health endpoints only
#    scan               Trigger manual security scan on server
#    status             Show live status of all services on server
#    logs               Tail live logs (choose: api | admin | user | nginx)
#    help               Show this help message
#
#  EXAMPLES:
#    ./deploy/deploy-playbook.sh github-setup
#    ./deploy/deploy-playbook.sh server-bootstrap
#    ./deploy/deploy-playbook.sh deploy-portfolio
#    ./deploy/deploy-playbook.sh test
#    ./deploy/deploy-playbook.sh logs api
# =============================================================================
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
SERVER_IP="46.224.231.217"
SERVER_USER="root"
SERVER="${SERVER_USER}@${SERVER_IP}"

PORTFOLIO_REPO="https://github.com/aleksicdacha/portfolio"
REALESTATE_REPO="https://github.com/aleksicdacha/RealEstatesAPI-NestJS"

PORTFOLIO_REMOTE_DIR="/root/Portfolio"
REALESTATE_REMOTE_DIR="/root/RealEstatesAPI-NestJS"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# App ports (nginx public-facing)
PORT_API=8090
PORT_ADMIN=8081
PORT_USER=8082

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'
BOLD='\033[1m'; NC='\033[0m'

ok()      { echo -e "${GREEN}  ✔  $*${NC}"; }
fail()    { echo -e "${RED}  ✘  $*${NC}"; }
info()    { echo -e "${CYAN}  ▶  $*${NC}"; }
warn()    { echo -e "${YELLOW}  ⚠  $*${NC}"; }
header()  { echo; echo -e "${BOLD}${CYAN}══ $* ══${NC}"; echo; }
step()    { echo -e "${BOLD}  $*${NC}"; }

# ── SSH helper ────────────────────────────────────────────────────────────────
ssh_exec() { ssh -o ConnectTimeout=10 "${SERVER}" "$@"; }
ssh_exec_timeout() { local t=$1; shift; ssh -o ConnectTimeout="${t}" "${SERVER}" "$@"; }

# =============================================================================
#  PHASE: github-setup
# =============================================================================
phase_github_setup() {
    header "PHASE 1 — GitHub Setup (one-time)"

    echo -e "${BOLD}1A. Add these GitHub Secrets to RealEstatesAPI-NestJS:${NC}"
    echo "     Settings → Secrets and variables → Actions → New repository secret"
    echo
    echo "  Secret name               Value"
    echo "  ─────────────────────────────────────────────────────────────────────"
    echo "  HETZNER_HOST              ${SERVER_IP}"
    echo "  HETZNER_USER              ${SERVER_USER}"
    echo "  HETZNER_SSH_PRIVATE_KEY   (contents of ~/.ssh/id_ed25519 — see below)"
    echo "  ALERT_EMAIL_USER          aleksic.dacha@gmail.com"
    echo "  ALERT_EMAIL_PASSWORD      Gmail App Password (NOT your real password)"
    echo "                            Get one at: https://myaccount.google.com/apppasswords"
    echo
    echo -e "${BOLD}1B. Add these secrets to portfolio too:${NC}"
    echo "  ALERT_EMAIL_USER          (same as above)"
    echo "  ALERT_EMAIL_PASSWORD      (same as above)"
    echo

    step "Your private key content (copy this as HETZNER_SSH_PRIVATE_KEY):"
    if [[ -f ~/.ssh/id_ed25519 ]]; then
        echo "─────────────────────────────────────────"
        cat ~/.ssh/id_ed25519
        echo "─────────────────────────────────────────"
    else
        warn "~/.ssh/id_ed25519 not found — check your SSH key path"
    fi

    echo
    echo -e "${BOLD}1C. Enable GitHub Security features for BOTH repos:${NC}"
    echo "     Settings → Security → Code security"
    echo
    for repo in "$PORTFOLIO_REPO" "$REALESTATE_REPO"; do
        echo "  ${repo}/settings/security_analysis"
    done
    echo
    echo "  Turn ON:"
    echo "    ✅ Dependabot alerts"
    echo "    ✅ Dependabot security updates"
    echo "    ✅ CodeQL analysis"
    echo "    ✅ Secret scanning"
    echo "    ✅ Secret scanning push protection"
    echo

    echo -e "${BOLD}1D. Branch protection on master (RealEstatesAPI-NestJS):${NC}"
    echo "     ${REALESTATE_REPO}/settings/branches"
    echo "     Add ruleset for 'master':"
    echo "    ✅ Require status checks: security-scan / npm-audit, security-scan / codeql"
    echo "    ✅ Require branches to be up to date"
    echo "    ✅ Block force pushes"
    echo

    ok "GitHub setup instructions printed. Complete these steps in the browser."
}

# =============================================================================
#  PHASE: server-bootstrap
# =============================================================================
phase_server_bootstrap() {
    header "PHASE 2 — Server Bootstrap (one-time, fresh machine)"

    warn "This is destructive on a fresh machine — do NOT run on a live server with data."
    read -r -p "  Continue? [y/N] " confirm
    [[ "${confirm,,}" != "y" ]] && { info "Aborted."; exit 0; }

    step "2A. Checking SSH connectivity..."
    if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "${SERVER}" true 2>/dev/null; then
        fail "Cannot SSH to ${SERVER}. Check your key and server availability."
        exit 1
    fi
    ok "SSH to ${SERVER} works"

    step "2B. Copying setup files to server..."
    scp "${SCRIPT_DIR}/server-hardening/setup-server.sh"                "${SERVER}:/root/"
    scp "${SCRIPT_DIR}/server-hardening/setup-security-monitoring.sh"   "${SERVER}:/root/"
    scp "${SCRIPT_DIR}/server-hardening/daily-security-scan.sh"         "${SERVER}:/root/"
    scp "${SCRIPT_DIR}/server-hardening/fail2ban-jail.local"            "${SERVER}:/root/"
    scp "${SCRIPT_DIR}/server-hardening/sshd_hardened.conf"             "${SERVER}:/root/"
    scp "${SCRIPT_DIR}/server-hardening/msmtp.conf.template"            "${SERVER}:/root/msmtp.conf"
    scp -r "${SCRIPT_DIR}/nginx"                                         "${SERVER}:/root/setup-nginx"
    ok "Files copied"

    step "2C. You must now fill in credentials on the server before continuing."
    echo
    echo "  Run: ssh ${SERVER}"
    echo "  Then edit these files:"
    echo
    echo "    nano /root/setup-server.sh"
    echo "      → AUTHORIZED_KEY       (your SSH public key)"
    echo "      → FAIL2BAN_IGNORE_IPS  (your home/VPN IP)"
    echo "      → GITHUB_TOKEN         (GitHub PAT if repos are private)"
    echo
    echo "    nano /root/msmtp.conf"
    echo "      → YOUR_GMAIL           (your Gmail address)"
    echo "      → YOUR_APP_PASSWORD_HERE  (Gmail App Password)"
    echo
    echo "    nano /root/setup-security-monitoring.sh"
    echo "      → ALERT_EMAIL          (your email)"
    echo "      → SMTP_FROM            (your Gmail)"
    echo
    read -r -p "  Press ENTER when you have filled in all credentials on the server..."

    step "2D. Running server bootstrap (takes ~10 min)..."
    ssh_exec_timeout 900 "bash /root/setup-server.sh 2>&1 | tee /root/setup.log"
    ok "Server bootstrap complete"

    step "2E. Setting up .env files on server..."
    warn "You must manually create these files on the server:"
    echo
    echo "  ssh ${SERVER}"
    echo
    echo "  cat > ${REALESTATE_REMOTE_DIR}/apps/api/.env << 'EOF'"
    echo "  DB_HOST=localhost"
    echo "  DB_PORT=5432"
    echo "  DB_USERNAME=postgres"
    echo "  DB_PASSWORD=STRONG_PASSWORD_HERE"
    echo "  DB_NAME=estates"
    echo "  JWT_SECRET=AT_LEAST_32_CHARS_RANDOM_STRING"
    echo "  JWT_EXPIRES_IN=30m"
    echo "  JWT_REFRESH_SECRET=ANOTHER_32_CHAR_RANDOM_STRING"
    echo "  JWT_REFRESH_EXPIRES_IN=7d"
    echo "  NODE_ENV=production"
    echo "  PORT=3000"
    echo "  CORS_ORIGIN=http://${SERVER_IP}:${PORT_ADMIN},http://${SERVER_IP}:${PORT_USER}"
    echo "  GEMINI_API_KEY=your_key_here"
    echo "  EOF"
    echo
    echo "  cat > ${REALESTATE_REMOTE_DIR}/apps/user-web/.env.local << 'EOF'"
    echo "  NEXT_PUBLIC_API_URL=http://${SERVER_IP}:${PORT_API}/v1"
    echo "  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here"
    echo "  EOF"
    echo
    read -r -p "  Press ENTER when .env files are created on server..."

    step "2F. Running security monitoring setup..."
    ssh_exec_timeout 600 "bash /root/setup-security-monitoring.sh 2>&1 | tee /root/security-setup.log"
    ok "Security monitoring installed"

    step "2G. Applying nginx configs..."
    ssh_exec "
        cp -r /root/setup-nginx/conf.d/*          /etc/nginx/conf.d/
        cp -r /root/setup-nginx/snippets/*        /etc/nginx/snippets/
        cp    /root/setup-nginx/nginx.conf        /etc/nginx/nginx.conf
        cp    /root/setup-nginx/sites-available/* /etc/nginx/sites-available/
        ln -sf /etc/nginx/sites-available/portfolio.conf  /etc/nginx/sites-enabled/
        ln -sf /etc/nginx/sites-available/realestate.conf /etc/nginx/sites-enabled/
        nginx -t && systemctl reload nginx
    "
    ok "nginx configured"

    step "2H. Initialising expected-ports baseline..."
    ssh_exec "ss -tlnp | awk 'NR>1 {print \$4}' | sort -u > /etc/security/expected-ports.conf"
    ok "Port baseline saved to /etc/security/expected-ports.conf"

    echo
    ok "Bootstrap complete. Running verification tests..."
    phase_test
}

# =============================================================================
#  PHASE: deploy-portfolio
# =============================================================================
phase_deploy_portfolio() {
    header "Deploy: Portfolio (Angular → Hetzner)"

    step "Building production bundle..."
    cd "${PROJECT_ROOT}"
    npm run build -- --configuration=production

    step "Rsyncing to ${SERVER}:${PORTFOLIO_REMOTE_DIR}..."
    rsync -avz --delete \
        --exclude=".git" \
        dist/portfolio/browser/ \
        "${SERVER}:${PORTFOLIO_REMOTE_DIR}/"

    step "Reloading nginx..."
    ssh_exec "nginx -t && systemctl reload nginx"

    ok "Portfolio deployed → http://${SERVER_IP}"

    # Quick smoke test
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://${SERVER_IP}" || echo "000")
    if [[ "${HTTP_CODE}" == "200" || "${HTTP_CODE}" == "301" || "${HTTP_CODE}" == "302" ]]; then
        ok "Smoke test passed (HTTP ${HTTP_CODE})"
    else
        fail "Smoke test: HTTP ${HTTP_CODE} — check nginx logs"
    fi
}

# =============================================================================
#  PHASE: deploy-nginx
# =============================================================================
phase_deploy_nginx() {
    header "Deploy: nginx config changes → server"

    step "Syncing nginx files..."
    scp "${SCRIPT_DIR}/nginx/nginx.conf"                       "${SERVER}:/etc/nginx/nginx.conf"
    scp "${SCRIPT_DIR}/nginx/conf.d/rate-limiting.conf"        "${SERVER}:/etc/nginx/conf.d/"
    scp "${SCRIPT_DIR}/nginx/snippets/security-headers.conf"   "${SERVER}:/etc/nginx/snippets/"
    scp "${SCRIPT_DIR}/nginx/snippets/ssl-params.conf"         "${SERVER}:/etc/nginx/snippets/"
    scp "${SCRIPT_DIR}/nginx/sites-available/realestate.conf"  "${SERVER}:/etc/nginx/sites-available/"
    scp "${SCRIPT_DIR}/nginx/sites-available/portfolio.conf"   "${SERVER}:/etc/nginx/sites-available/"

    step "Testing nginx config on server..."
    ssh_exec "nginx -t"

    step "Reloading nginx..."
    ssh_exec "systemctl reload nginx"

    ok "nginx reloaded cleanly"
}

# =============================================================================
#  PHASE: deploy-realestate  (manual fallback — push to master normally)
# =============================================================================
phase_deploy_realestate() {
    header "Deploy: RealEstatesAPI-NestJS → server (manual)"

    warn "Normally this happens automatically when you push to master."
    warn "Use this only if GitHub Actions is unavailable or for a hotfix."
    read -r -p "  Continue with manual deploy? [y/N] " confirm
    [[ "${confirm,,}" != "y" ]] && { info "Aborted. Just push to master instead."; exit 0; }

    step "Syncing code (excluding .env, uploads, node_modules)..."
    REALESTATE_LOCAL="$(cd "${PROJECT_ROOT}/../RealEstatesAPI-NestJS" && pwd)"
    rsync -az --delete \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.next' \
        --exclude='.env' \
        --exclude='.env.local' \
        --exclude='.env.production' \
        --exclude='uploads' \
        --exclude='logs' \
        "${REALESTATE_LOCAL}/" \
        "${SERVER}:${REALESTATE_REMOTE_DIR}/"

    step "Building and restarting Docker containers..."
    ssh_exec_timeout 600 "
        set -e
        cd ${REALESTATE_REMOTE_DIR}
        docker compose -f docker-compose.prod.yml build api admin-web user-web
        docker compose -f docker-compose.prod.yml up -d
        sleep 10
        docker compose -f docker-compose.prod.yml ps
    "

    step "Waiting for API health check..."
    sleep 15

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 \
        "http://${SERVER_IP}:${PORT_API}/v1/properties/public?page=1&limit=1" || echo "000")
    if [[ "${HTTP_CODE}" == "200" ]]; then
        ok "API health check passed (HTTP ${HTTP_CODE})"
    else
        fail "API health check failed (HTTP ${HTTP_CODE})"
        echo "  Check logs: ./deploy/deploy-playbook.sh logs api"
    fi
}

# =============================================================================
#  PHASE: run-migrations
# =============================================================================
phase_run_migrations() {
    header "Run TypeORM migrations on server"

    step "Running migrations inside API container..."
    ssh_exec "
        cd ${REALESTATE_REMOTE_DIR}
        docker compose -f docker-compose.prod.yml exec -T api npm run migration:run
    "
    ok "Migrations complete"
}

# =============================================================================
#  PHASE: test (full suite)
# =============================================================================
phase_test() {
    header "Verification Tests — ${SERVER_IP}"
    PASS=0; FAIL=0

    _check() {
        local label="$1" result="$2"
        if [[ "${result}" == "pass" ]]; then
            ok "${label}"; PASS=$((PASS+1))
        else
            fail "${label}: ${result}"; FAIL=$((FAIL+1))
        fi
    }

    # ── Test 1: Connectivity ──────────────────────────────────────────────────
    header "Test 1: Service connectivity"

    # API: check /v1/properties/public since root path has no route in NestJS
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
        "http://${SERVER_IP}:${PORT_API}/v1/properties/public?page=1&limit=1" 2>/dev/null || echo "000")
    if [[ "${code}" =~ ^(2|3) ]]; then
        _check "API site (port ${PORT_API})" "pass"
    else
        _check "API site (port ${PORT_API})" "HTTP ${code}"
    fi

    # Admin and User: accept any 2xx/3xx (307 redirect to locale/https is normal)
    for label_port in "Admin:${PORT_ADMIN}" "User:${PORT_USER}"; do
        label="${label_port%%:*}"
        port="${label_port##*:}"
        code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
            "http://${SERVER_IP}:${port}/" 2>/dev/null || echo "000")
        if [[ "${code}" =~ ^(2|3) ]]; then
            _check "${label} site (port ${port})" "pass"
        else
            _check "${label} site (port ${port})" "HTTP ${code}"
        fi
    done

    # Portfolio (port 80)
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
        "http://${SERVER_IP}/" 2>/dev/null || echo "000")
    if [[ "${code}" =~ ^(2|3) ]]; then
        _check "Portfolio (port 80)" "pass"
    else
        _check "Portfolio (port 80)" "HTTP ${code}"
    fi

    # ── Test 2: API endpoint ──────────────────────────────────────────────────
    header "Test 2: API public endpoint"

    API_RESPONSE=$(curl -s --max-time 10 \
        "http://${SERVER_IP}:${PORT_API}/v1/properties/public?page=1&limit=1" 2>/dev/null || echo "")
    if echo "${API_RESPONSE}" | grep -q "data\|items\|properties\|\[\]"; then
        _check "GET /v1/properties/public returns JSON" "pass"
    else
        _check "GET /v1/properties/public returns JSON" "unexpected response: ${API_RESPONSE:0:100}"
    fi

    # ── Test 3: Security headers ──────────────────────────────────────────────
    header "Test 3: HTTP security headers"
    HEADERS=$(curl -sI --max-time 10 "http://${SERVER_IP}:${PORT_API}/v1/properties/public?page=1&limit=1" 2>/dev/null || echo "")

    for header in "x-frame-options" "x-content-type-options" "referrer-policy"; do
        if echo "${HEADERS}" | grep -qi "${header}"; then
            _check "Header: ${header}" "pass"
        else
            _check "Header: ${header}" "MISSING"
        fi
    done

    # ── Test 4: CORS enforcement ──────────────────────────────────────────────
    header "Test 4: CORS blocking unauthorized origins"

    CORS_RESPONSE=$(curl -sI --max-time 10 \
        -H "Origin: http://evil-attacker.com" \
        "http://${SERVER_IP}:${PORT_API}/v1/properties/public" 2>/dev/null || echo "")
    if echo "${CORS_RESPONSE}" | grep -qi "access-control-allow-origin: http://evil"; then
        _check "CORS blocks evil.com origin" "FAIL — evil origin was allowed!"
    else
        _check "CORS blocks evil.com origin" "pass"
    fi

    # ── Test 5: Auth rate limiting ────────────────────────────────────────────
    header "Test 5: Auth brute-force protection (6 rapid login attempts)"

    GOT_429=false
    for i in {1..6}; do
        CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
            -X POST "http://${SERVER_IP}:${PORT_API}/v1/auth/login" \
            -H "Content-Type: application/json" \
            -d '{"username":"nonexistent_test_user","password":"wrongpassword123"}' \
            2>/dev/null || echo "000")
        echo "    Attempt ${i}: HTTP ${CODE}"
        if [[ "${CODE}" == "429" ]]; then GOT_429=true; fi
    done
    if [[ "${GOT_429}" == "true" ]]; then
        _check "Rate limiting triggers 429 on repeated login attempts" "pass"
    else
        _check "Rate limiting triggers 429 on repeated login attempts" "429 never returned — check throttler config"
    fi

    # ── Test 6: Upload requires auth ──────────────────────────────────────────
    header "Test 6: Upload endpoint requires authentication"

    UPLOAD_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
        -X POST "http://${SERVER_IP}:${PORT_API}/v1/upload" \
        -F "files=@${SCRIPT_DIR}/deploy-playbook.sh" \
        2>/dev/null || echo "000")
    if [[ "${UPLOAD_CODE}" == "401" || "${UPLOAD_CODE}" == "403" ]]; then
        _check "Upload requires auth (HTTP ${UPLOAD_CODE})" "pass"
    else
        _check "Upload requires auth" "expected 401/403, got HTTP ${UPLOAD_CODE}"
    fi

    # ── Test 7: Scanner path blocking ─────────────────────────────────────────
    header "Test 7: Scanner/bot path blocking"

    for path in "/wp-admin" "/phpmyadmin" "/.env" "/.git"; do
        CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
            "http://${SERVER_IP}:${PORT_API}${path}" 2>/dev/null || echo "000")
        if [[ "${CODE}" == "403" || "${CODE}" == "404" || "${CODE}" == "444" ]]; then
            _check "Blocks ${path} (HTTP ${CODE})" "pass"
        else
            _check "Blocks ${path}" "expected 403/404/444, got HTTP ${CODE}"
        fi
    done

    # ── Test 8: fail2ban running ──────────────────────────────────────────────
    header "Test 8: Server security daemons"

    for service in "fail2ban" "ufw" "clamav-freshclam" "auditd"; do
        STATUS=$(ssh_exec "systemctl is-active ${service} 2>/dev/null" || echo "inactive")
        if [[ "${STATUS}" == "active" ]]; then
            _check "${service} is running" "pass"
        else
            _check "${service} is running" "INACTIVE — run setup-security-monitoring.sh"
        fi
    done

    # ── Test 9: Docker containers ─────────────────────────────────────────────
    header "Test 9: Docker container health"

    CONTAINER_STATUS=$(ssh_exec "docker compose -f ${REALESTATE_REMOTE_DIR}/docker-compose.prod.yml ps --format 'table {{.Name}}\t{{.Status}}' 2>/dev/null" || echo "")
    if [[ -n "${CONTAINER_STATUS}" ]]; then
        echo "${CONTAINER_STATUS}"
        UNHEALTHY=$(echo "${CONTAINER_STATUS}" | grep -ci "unhealthy\|exited\|error" || true)
        if [[ "${UNHEALTHY}" -eq 0 ]]; then
            _check "All Docker containers healthy" "pass"
        else
            _check "All Docker containers healthy" "${UNHEALTHY} containers unhealthy"
        fi
    else
        _check "Docker containers readable" "could not list containers"
    fi

    # ── Summary ───────────────────────────────────────────────────────────────
    echo
    echo -e "${BOLD}══════════════════════════════════════════${NC}"
    echo -e "${BOLD}  Test results: ${GREEN}${PASS} passed${NC}  ${RED}${FAIL} failed${NC}"
    echo -e "${BOLD}══════════════════════════════════════════${NC}"
    echo

    if [[ ${FAIL} -gt 0 ]]; then
        warn "Some tests failed. Check the output above for details."
        warn "Logs: ./deploy/deploy-playbook.sh logs api"
        return 1
    else
        ok "All tests passed."
    fi
}

# =============================================================================
#  PHASE: test-headers
# =============================================================================
phase_test_headers() {
    header "Security Header Test — ${SERVER_IP}"
    for port in "${PORT_API}" "${PORT_USER}" "80"; do
        echo -e "${BOLD}  Port ${port}:${NC}"
        curl -sI --max-time 10 "http://${SERVER_IP}:${port}/" 2>/dev/null \
            | grep -iE "x-frame|x-content|strict-transport|referrer|permissions|content-security|cross-origin" \
            | sed 's/^/    /' \
            || echo "    (no response)"
        echo
    done
}

# =============================================================================
#  PHASE: test-ratelimit
# =============================================================================
phase_test_ratelimit() {
    header "Rate Limit Test — ${SERVER_IP}:${PORT_API}"
    echo "  Sending 8 rapid login attempts..."
    echo
    for i in {1..8}; do
        CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
            -X POST "http://${SERVER_IP}:${PORT_API}/v1/auth/login" \
            -H "Content-Type: application/json" \
            -d '{"username":"ratelimit_test","password":"wrongpassword"}' \
            2>/dev/null || echo "000")
        printf "  Attempt %d: HTTP %s\n" "${i}" "${CODE}"
        [[ "${CODE}" == "429" ]] && { ok "Rate limit triggered at attempt ${i}"; break; }
    done
}

# =============================================================================
#  PHASE: test-auth
# =============================================================================
phase_test_auth() {
    header "Auth Endpoint Security Tests — ${SERVER_IP}:${PORT_API}"

    echo "  Testing upload without auth..."
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
        -X POST "http://${SERVER_IP}:${PORT_API}/v1/upload" \
        -F "files=@${BASH_SOURCE[0]}" 2>/dev/null || echo "000")
    [[ "${CODE}" == "401" || "${CODE}" == "403" ]] \
        && ok "Upload blocked without auth (HTTP ${CODE})" \
        || fail "Upload NOT blocked (HTTP ${CODE})"

    echo "  Testing CORS with evil origin..."
    ALLOW=$(curl -sI --max-time 10 \
        -H "Origin: http://evil-attacker.com" \
        "http://${SERVER_IP}:${PORT_API}/v1/properties/public" 2>/dev/null \
        | grep -i "access-control-allow-origin" || echo "")
    [[ -z "${ALLOW}" ]] \
        && ok "CORS correctly blocks evil-attacker.com" \
        || fail "CORS allowed evil-attacker.com: ${ALLOW}"

    echo "  Testing admin routes without auth..."
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
        "http://${SERVER_IP}:${PORT_API}/v1/users" 2>/dev/null || echo "000")
    [[ "${CODE}" == "401" || "${CODE}" == "403" ]] \
        && ok "Admin /v1/users blocked without auth (HTTP ${CODE})" \
        || fail "/v1/users returned HTTP ${CODE} (expected 401/403)"
}

# =============================================================================
#  PHASE: test-health
# =============================================================================
phase_test_health() {
    header "Health Check — all services"

    check_http() {
        local label="$1" url="$2"
        CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${url}" 2>/dev/null || echo "000")
        if [[ "${CODE}" =~ ^(2|3) ]]; then
            ok "${label} HTTP ${CODE}"
        else
            fail "${label} HTTP ${CODE}"
        fi
    }

    check_http "API health"       "http://${SERVER_IP}:${PORT_API}/v1/properties/public?page=1&limit=1"
    check_http "Portfolio"        "http://${SERVER_IP}/"
    check_http "Admin panel"      "http://${SERVER_IP}:${PORT_ADMIN}/"
    check_http "User website"     "http://${SERVER_IP}:${PORT_USER}/"

    echo
    info "Docker containers:"
    ssh_exec "docker compose -f ${REALESTATE_REMOTE_DIR}/docker-compose.prod.yml ps" 2>/dev/null || warn "Could not reach server"

    echo
    info "PM2 processes:"
    ssh_exec "pm2 list 2>/dev/null" || warn "PM2 not running or no processes"
}

# =============================================================================
#  PHASE: scan
# =============================================================================
phase_scan() {
    header "Triggering manual security scan on server"

    step "Uploading/updating scan script on server..."
    scp -o ConnectTimeout=10 \
        "${SCRIPT_DIR}/server-hardening/daily-security-scan.sh" \
        "${SERVER}:/usr/local/bin/daily-security-scan.sh"
    ssh_exec "chmod +x /usr/local/bin/daily-security-scan.sh"
    ok "Scan script installed at /usr/local/bin/daily-security-scan.sh"

    # Also install the cron job if missing
    if ! ssh_exec "test -f /etc/cron.d/daily-security-scan" 2>/dev/null; then
        ssh_exec "printf '30 3 * * * root /usr/local/bin/daily-security-scan.sh\n' > /etc/cron.d/daily-security-scan && chmod 644 /etc/cron.d/daily-security-scan"
        ok "Cron job installed (runs daily at 03:30)"
    fi

    warn "Running full scan — takes 3-8 minutes. Output streamed live."
    echo
    ssh_exec "/usr/local/bin/daily-security-scan.sh"
}

# =============================================================================
#  PHASE: status
# =============================================================================
phase_status() {
    header "Live server status — ${SERVER_IP}"

    step "Docker containers:"
    ssh_exec "docker compose -f ${REALESTATE_REMOTE_DIR}/docker-compose.prod.yml ps" || true

    echo
    step "PM2 processes:"
    ssh_exec "pm2 list" || true

    echo
    step "nginx:"
    ssh_exec "nginx -t 2>&1 && systemctl is-active nginx" || true

    echo
    step "fail2ban bans today:"
    ssh_exec "grep \"$(date +%Y-%m-%d)\" /var/log/fail2ban.log 2>/dev/null | grep -c 'Ban ' || echo 0" || true

    echo
    step "Disk usage:"
    ssh_exec "df -h /" || true

    echo
    step "Memory:"
    ssh_exec "free -h" || true
}

# =============================================================================
#  PHASE: logs
# =============================================================================
phase_logs() {
    local target="${1:-api}"
    header "Live logs: ${target}"

    case "${target}" in
        api)
            ssh_exec "docker compose -f ${REALESTATE_REMOTE_DIR}/docker-compose.prod.yml logs -f api" ;;
        admin)
            ssh_exec "docker compose -f ${REALESTATE_REMOTE_DIR}/docker-compose.prod.yml logs -f admin-web" ;;
        user)
            ssh_exec "docker compose -f ${REALESTATE_REMOTE_DIR}/docker-compose.prod.yml logs -f user-web" ;;
        nginx)
            ssh_exec "tail -f /var/log/nginx/realestate_api_access.log /var/log/nginx/error.log" ;;
        scan)
            ssh_exec "tail -f /var/log/security/scan-$(date +%F).log 2>/dev/null || ls /var/log/security/" ;;
        fail2ban)
            ssh_exec "tail -f /var/log/fail2ban.log" ;;
        *)
            warn "Unknown log target: ${target}"
            echo "  Available: api | admin | user | nginx | scan | fail2ban"
            exit 1
            ;;
    esac
}

# =============================================================================
#  PHASE: help
# =============================================================================
phase_help() {
    echo
    echo -e "${BOLD}deploy-playbook.sh — Complete deploy, setup & test tool${NC}"
    echo
    echo -e "${BOLD}USAGE:${NC}"
    echo "  ./deploy/deploy-playbook.sh <phase> [options]"
    echo
    echo -e "${BOLD}PHASES:${NC}"
    printf "  ${CYAN}%-22s${NC} %s\n" "github-setup"       "GitHub Secrets + security features checklist"
    printf "  ${CYAN}%-22s${NC} %s\n" "server-bootstrap"   "One-time server setup (fresh machine only)"
    printf "  ${CYAN}%-22s${NC} %s\n" "deploy-portfolio"   "Build + rsync Angular, reload nginx"
    printf "  ${CYAN}%-22s${NC} %s\n" "deploy-nginx"       "Sync nginx configs, test + reload"
    printf "  ${CYAN}%-22s${NC} %s\n" "deploy-realestate"  "Manual deploy (normally auto via Actions)"
    printf "  ${CYAN}%-22s${NC} %s\n" "run-migrations"     "Run TypeORM migrations in API container"
    printf "  ${CYAN}%-22s${NC} %s\n" "test"               "Full verification suite (all tests)"
    printf "  ${CYAN}%-22s${NC} %s\n" "test-headers"       "HTTP security headers only"
    printf "  ${CYAN}%-22s${NC} %s\n" "test-ratelimit"     "Rate limiting + brute-force test only"
    printf "  ${CYAN}%-22s${NC} %s\n" "test-auth"          "Auth security tests only"
    printf "  ${CYAN}%-22s${NC} %s\n" "test-health"        "All app health endpoints"
    printf "  ${CYAN}%-22s${NC} %s\n" "scan"               "Trigger manual security scan on server"
    printf "  ${CYAN}%-22s${NC} %s\n" "status"             "Live status of all services"
    printf "  ${CYAN}%-22s${NC} %s\n" "logs <target>"      "Tail live logs: api|admin|user|nginx|scan|fail2ban"
    echo
    echo -e "${BOLD}EXAMPLES:${NC}"
    echo "  ./deploy/deploy-playbook.sh github-setup"
    echo "  ./deploy/deploy-playbook.sh server-bootstrap"
    echo "  ./deploy/deploy-playbook.sh deploy-portfolio"
    echo "  ./deploy/deploy-playbook.sh deploy-nginx"
    echo "  ./deploy/deploy-playbook.sh test"
    echo "  ./deploy/deploy-playbook.sh logs api"
    echo "  ./deploy/deploy-playbook.sh logs nginx"
    echo "  ./deploy/deploy-playbook.sh status"
    echo "  ./deploy/deploy-playbook.sh scan"
    echo
    echo -e "${BOLD}NORMAL WORKFLOW (day-to-day):${NC}"
    echo "  git push origin master          → auto-deploys RealEstatesAPI via GitHub Actions"
    echo "  ./deploy/deploy-playbook.sh deploy-portfolio   → deploys Angular portfolio"
    echo "  ./deploy/deploy-playbook.sh test               → verify everything is working"
    echo
}

# =============================================================================
#  ENTRYPOINT
# =============================================================================
PHASE="${1:-help}"

case "${PHASE}" in
    github-setup)       phase_github_setup ;;
    server-bootstrap)   phase_server_bootstrap ;;
    deploy-portfolio)   phase_deploy_portfolio ;;
    deploy-nginx)       phase_deploy_nginx ;;
    deploy-realestate)  phase_deploy_realestate ;;
    run-migrations)     phase_run_migrations ;;
    test)               phase_test ;;
    test-headers)       phase_test_headers ;;
    test-ratelimit)     phase_test_ratelimit ;;
    test-auth)          phase_test_auth ;;
    test-health)        phase_test_health ;;
    scan)               phase_scan ;;
    status)             phase_status ;;
    logs)               phase_logs "${2:-api}" ;;
    help|--help|-h)     phase_help ;;
    *)
        fail "Unknown phase: ${PHASE}"
        echo
        phase_help
        exit 1
        ;;
esac
