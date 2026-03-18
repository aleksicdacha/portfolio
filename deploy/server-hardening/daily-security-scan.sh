#!/usr/bin/env bash
# =============================================================================
#  daily-security-scan.sh — Comprehensive daily security scan
#
#  Installed to: /usr/local/bin/daily-security-scan.sh
#  Cron:         /etc/cron.d/daily-security-scan (runs at 03:30 daily)
#
#  Sends email when any of these are found:
#    - ClamAV: infected files
#    - rkhunter/chkrootkit: rootkits or suspicious files
#    - Lynis: HIGH or CRITICAL findings
#    - AIDE: unexpected file changes
#    - fail2ban: active bans (summary)
#    - auditd: auth failures, privilege escalations
#    - OS: upgradable security packages
#    - Ports: unexpected open listening ports
#    - Logins: suspicious login activity
#
#  Sends ALWAYS on Sunday (weekly full report regardless of findings).
#
#  !! EDIT THESE before using (setup-security-monitoring.sh sets them auto) !!
# =============================================================================
set -euo pipefail

ALERT_EMAIL="YOUR_EMAIL@gmail.com"
SMTP_FROM="YOUR_GMAIL@gmail.com"

# ── Internal config ───────────────────────────────────────────────────────────
HOST="$(hostname -f 2>/dev/null || hostname)"
DATE="$(date +%F)"
TIME="$(date +%T)"
DOW="$(date +%u)"   # 1=Mon … 7=Sun
REPORT_DIR="/var/log/security"
REPORT_FILE="${REPORT_DIR}/scan-${DATE}.log"
ISSUES_FILE="${REPORT_DIR}/scan-${DATE}-issues.log"
EXPECTED_PORTS_FILE="/etc/security/expected-ports.conf"

mkdir -p "${REPORT_DIR}"
chmod 750 "${REPORT_DIR}"
> "${ISSUES_FILE}"

# ── Helpers ───────────────────────────────────────────────────────────────────
section() { echo; echo "══════════════════════════════════════════"; echo "  $*"; echo "══════════════════════════════════════════"; }
issue()   { echo "[ISSUE] $*" | tee -a "${ISSUES_FILE}"; }
info()    { echo "[INFO]  $*"; }

# ── Start report ──────────────────────────────────────────────────────────────
{
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Daily Security Scan Report                             ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "  Host:   ${HOST}"
echo "  Date:   ${DATE} ${TIME}"
echo "  Script: $0"
echo "╚══════════════════════════════════════════════════════════╝"

# =============================================================================
# 1. SYSTEM OVERVIEW
# =============================================================================
section "1. SYSTEM OVERVIEW"
info "Uptime:    $(uptime -p)"
info "Load avg:  $(cat /proc/loadavg | awk '{print $1,$2,$3}')"
info "Disk:"; df -h / /tmp 2>/dev/null || true
info "RAM:"; free -h
info "Kernel:    $(uname -r)"

# Check for failed systemd services
FAILED_SERVICES="$(systemctl --failed --no-legend 2>/dev/null | awk '{print $1}' | tr '\n' ' ')"
if [[ -n "${FAILED_SERVICES// }" ]]; then
    issue "Failed systemd services: ${FAILED_SERVICES}"
    systemctl --failed 2>/dev/null || true
fi

# =============================================================================
# 2. SECURITY PATCHES — upgradable packages
# =============================================================================
section "2. SECURITY PATCHES"
apt-get -s upgrade 2>/dev/null | grep "^Inst" | grep -i security > /tmp/security-upgrades.txt || true
SECURITY_COUNT="$(wc -l < /tmp/security-upgrades.txt)"

if [[ "${SECURITY_COUNT}" -gt 0 ]]; then
    issue "Upgradable SECURITY packages: ${SECURITY_COUNT}"
    cat /tmp/security-upgrades.txt
else
    info "No pending security upgrades"
fi

# All upgradable (informational)
TOTAL_UPGRADABLE="$(apt list --upgradable 2>/dev/null | grep -c "/" || true)"
info "Total upgradable packages: ${TOTAL_UPGRADABLE}"

# Check if reboot required
if [[ -f /var/run/reboot-required ]]; then
    issue "REBOOT REQUIRED (kernel/lib update pending)"
    cat /var/run/reboot-required.pkgs 2>/dev/null || true
fi

# =============================================================================
# 3. CLAMAV — malware/virus scan
# =============================================================================
section "3. CLAMAV ANTIVIRUS"
# Update signatures first
freshclam --quiet 2>/dev/null || warn_clam="true"

# Scan high-risk directories
CLAM_RESULT="$(clamscan \
    --recursive \
    --infected \
    --no-summary \
    /home /tmp /var/tmp /root /var/www /root/RealEstatesAPI-NestJS /root/Portfolio \
    2>/dev/null)" || true

if [[ -n "${CLAM_RESULT}" ]]; then
    issue "ClamAV found infected files:"
    echo "${CLAM_RESULT}"
else
    info "ClamAV: no infected files found"
fi

# Print summary stats
clamscan --recursive --quiet --no-summary \
    /home /tmp /var/tmp /root /var/www \
    2>/dev/null; echo "(clean — no infections)" || true

# =============================================================================
# 4. RKHUNTER — rootkit detection
# =============================================================================
section "4. RKHUNTER (ROOTKIT HUNTER)"
rkhunter --update --quiet 2>/dev/null || true
rkhunter --check \
    --skip-keypress \
    --logfile /var/log/rkhunter.log \
    --report-warnings-only \
    2>/dev/null || true

RKHUNTER_WARNS="$(grep -c "Warning:" /var/log/rkhunter.log 2>/dev/null || echo 0)"
if [[ "${RKHUNTER_WARNS}" -gt 0 ]]; then
    issue "rkhunter warnings: ${RKHUNTER_WARNS}"
    grep "Warning:" /var/log/rkhunter.log | tail -20
else
    info "rkhunter: no warnings"
fi

# =============================================================================
# 5. CHKROOTKIT
# =============================================================================
section "5. CHKROOTKIT"
CHKROOTKIT_OUT="$(chkrootkit 2>/dev/null)"
CHKROOTKIT_INFECTED="$(echo "${CHKROOTKIT_OUT}" | grep -i "INFECTED\|Vulnerable\|not clean" || true)"

if [[ -n "${CHKROOTKIT_INFECTED}" ]]; then
    issue "chkrootkit found issues:"
    echo "${CHKROOTKIT_INFECTED}"
else
    info "chkrootkit: clean"
fi

# =============================================================================
# 6. AIDE — file integrity check
# =============================================================================
section "6. AIDE (FILE INTEGRITY)"
if [[ -f /var/lib/aide/aide.db ]]; then
    AIDE_OUT="$(aide --check 2>&1)" || true
    AIDE_CHANGES="$(echo "${AIDE_OUT}" | grep -E "^(Changed|Removed|Added):" | wc -l || echo 0)"
    if [[ "${AIDE_CHANGES}" -gt 0 ]]; then
        issue "AIDE detected ${AIDE_CHANGES} file changes:"
        echo "${AIDE_OUT}" | grep -E "^(Changed|Removed|Added):" | head -30
    else
        info "AIDE: no unexpected file changes"
    fi
else
    info "AIDE: no baseline database yet — run: aide --init && mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db"
fi

# =============================================================================
# 7. LYNIS — system security audit
# =============================================================================
section "7. LYNIS SECURITY AUDIT"
LYNIS_OUT="$(lynis audit system --quick --quiet 2>/dev/null)" || true
LYNIS_WARNINGS="$(echo "${LYNIS_OUT}" | grep -c "^!" || echo 0)"
LYNIS_SCORE="$(grep "Hardening index" /var/log/lynis.log 2>/dev/null | tail -1 || true)"

if [[ "${LYNIS_WARNINGS}" -gt 0 ]]; then
    issue "Lynis warnings: ${LYNIS_WARNINGS}"
    echo "${LYNIS_OUT}" | grep "^!" | head -20
fi
[[ -n "${LYNIS_SCORE}" ]] && info "Lynis score: ${LYNIS_SCORE}"

# Lynis suggestions count
LYNIS_SUGGESTIONS="$(grep -c "Suggestion" /var/log/lynis.log 2>/dev/null || echo 0)"
info "Lynis suggestions: ${LYNIS_SUGGESTIONS} (see /var/log/lynis.log)"

# =============================================================================
# 8. FAIL2BAN — active bans & recent activity
# =============================================================================
section "8. FAIL2BAN"
if command -v fail2ban-client &>/dev/null && systemctl is-active fail2ban &>/dev/null; then
    fail2ban-client status 2>/dev/null || true
    echo
    info "Active bans (SSH):"
    fail2ban-client status sshd 2>/dev/null || true
    echo
    # Count bans today
    TODAY_BANS="$(grep "$(date +%Y-%m-%d)" /var/log/fail2ban.log 2>/dev/null | grep -c "Ban " || echo 0)"
    if [[ "${TODAY_BANS}" -gt 10 ]]; then
        issue "High ban activity today: ${TODAY_BANS} bans — possible active attack"
    else
        info "Bans today: ${TODAY_BANS}"
    fi
    # Top attacking IPs
    echo
    info "Top attacking IPs (last 7 days):"
    grep "Ban " /var/log/fail2ban.log 2>/dev/null \
        | awk '{print $NF}' | sort | uniq -c | sort -rn | head -10 || true
else
    issue "fail2ban is NOT running"
fi

# =============================================================================
# 9. AUTH LOG — suspicious logins
# =============================================================================
section "9. LOGIN ACTIVITY (last 24h)"
SINCE="$(date -d '24 hours ago' '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -v-1d '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date '+%Y-%m-%d %H:%M:%S')"

# Successful logins
echo "Successful logins:"
last -F -a 2>/dev/null | head -10 || who -a 2>/dev/null || true
echo

# Failed logins
FAILED_LOGINS="$(journalctl -u ssh --since "${SINCE}" --no-pager -q 2>/dev/null \
    | grep -c "Failed password\|Invalid user\|Connection closed by invalid" || echo 0)"
if [[ "${FAILED_LOGINS}" -gt 50 ]]; then
    issue "HIGH number of failed SSH logins in last 24h: ${FAILED_LOGINS}"
else
    info "Failed SSH attempts (24h): ${FAILED_LOGINS}"
fi

# Root logins
ROOT_LOGINS="$(journalctl -u ssh --since "${SINCE}" --no-pager -q 2>/dev/null \
    | grep -c "Accepted.*root" || echo 0)"
info "Root logins (24h): ${ROOT_LOGINS}"

# =============================================================================
# 10. OPEN PORTS — detect unexpected listeners
# =============================================================================
section "10. OPEN LISTENING PORTS"
CURRENT_PORTS="$(ss -tlnp 2>/dev/null | awk 'NR>1 {print $4}' | sort -u)"
echo "${CURRENT_PORTS}"

if [[ -f "${EXPECTED_PORTS_FILE}" ]]; then
    UNEXPECTED="$(comm -23 \
        <(echo "${CURRENT_PORTS}") \
        <(sort "${EXPECTED_PORTS_FILE}"))"
    if [[ -n "${UNEXPECTED}" ]]; then
        issue "Unexpected listening ports (not in ${EXPECTED_PORTS_FILE}):"
        echo "${UNEXPECTED}"
    else
        info "All listening ports match expected ports"
    fi
else
    info "No expected ports config at ${EXPECTED_PORTS_FILE}"
    info "Create it to enable port drift detection:"
    info "  ss -tlnp | awk 'NR>1 {print \$4}' | sort -u > ${EXPECTED_PORTS_FILE}"
fi

# =============================================================================
# 11. DOCKER SECURITY
# =============================================================================
section "11. DOCKER"
if command -v docker &>/dev/null; then
    info "Running containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true
    echo
    # Check for containers running as root
    ROOT_CONTAINERS="$(docker ps -q 2>/dev/null | while read -r c; do
        user="$(docker inspect --format '{{.Config.User}}' "${c}" 2>/dev/null)"
        name="$(docker inspect --format '{{.Name}}' "${c}" 2>/dev/null)"
        [[ -z "${user}" ]] && echo "  ${name}: running as root (no USER set)"
    done)"
    if [[ -n "${ROOT_CONTAINERS}" ]]; then
        issue "Docker containers running as root:"
        echo "${ROOT_CONTAINERS}"
    fi
    # Check for images with known vulnerabilities via Trivy if available
    if command -v trivy &>/dev/null; then
        info "Trivy image scan:"
        docker images --format "{{.Repository}}:{{.Tag}}" 2>/dev/null | grep -v "<none>" | while read -r img; do
            trivy image --exit-code 0 --severity HIGH,CRITICAL --quiet "${img}" 2>/dev/null || true
        done
    fi
else
    info "Docker not installed"
fi

# =============================================================================
# 12. DISK & LOG HEALTH
# =============================================================================
section "12. DISK & LOGS"
df -h 2>/dev/null
echo

# Disk usage warning
DISK_USAGE="$(df / | awk 'NR==2 {print $5}' | tr -d '%')"
if [[ "${DISK_USAGE}" -gt 85 ]]; then
    issue "Disk usage is critically high: ${DISK_USAGE}%"
elif [[ "${DISK_USAGE}" -gt 75 ]]; then
    issue "Disk usage is high: ${DISK_USAGE}%"
else
    info "Disk usage: ${DISK_USAGE}% (OK)"
fi

# Log rotation check
info "Log sizes (top 10):"
du -sh /var/log/* 2>/dev/null | sort -rh | head -10 || true

# =============================================================================
# 13. AUDITD — recent security events
# =============================================================================
section "13. AUDITD SECURITY EVENTS (last 24h)"
if command -v ausearch &>/dev/null; then
    SUDO_ABUSE="$(ausearch --start today --key privilege_escalation 2>/dev/null | grep -c "type=EXECVE" || echo 0)"
    AUTH_CHANGES="$(ausearch --start today --key passwd_changes --key shadow_changes 2>/dev/null | grep -c "type=SYSCALL" || echo 0)"
    SUDOERS_CHANGES="$(ausearch --start today --key sudoers_changes 2>/dev/null | grep -c "type=SYSCALL" || echo 0)"

    info "Privilege escalations (today): ${SUDO_ABUSE}"
    info "Auth file changes (today): ${AUTH_CHANGES}"

    if [[ "${SUDOERS_CHANGES}" -gt 0 ]]; then
        issue "sudoers file was modified today (${SUDOERS_CHANGES} events)"
        ausearch --start today --key sudoers_changes 2>/dev/null | tail -20 || true
    fi
    if [[ "${AUTH_CHANGES}" -gt 0 ]]; then
        issue "passwd/shadow file was modified today"
    fi
else
    info "auditd/ausearch not available"
fi

# =============================================================================
# 14. PM2 APP HEALTH
# =============================================================================
section "14. PM2 APP STATUS"
if command -v pm2 &>/dev/null; then
    pm2 list 2>/dev/null || true
    STOPPED_APPS="$(pm2 list 2>/dev/null | grep -c "stopped\|errored" || echo 0)"
    if [[ "${STOPPED_APPS}" -gt 0 ]]; then
        issue "PM2 has ${STOPPED_APPS} stopped/errored app(s)"
    fi
else
    info "PM2 not installed"
fi

# =============================================================================
# SUMMARY
# =============================================================================
section "SCAN SUMMARY"
ISSUE_COUNT="$(wc -l < "${ISSUES_FILE}" 2>/dev/null || echo 0)"
echo "Issues found: ${ISSUE_COUNT}"
echo "Full report:  ${REPORT_FILE}"
echo
if [[ "${ISSUE_COUNT}" -gt 0 ]]; then
    echo "── ISSUES ──────────────────────────────────────────────────"
    cat "${ISSUES_FILE}"
    echo "────────────────────────────────────────────────────────────"
fi
echo "Scan completed: $(date '+%Y-%m-%d %H:%M:%S')"

} > "${REPORT_FILE}" 2>&1

# =============================================================================
# EMAIL LOGIC
# =============================================================================
ISSUE_COUNT="$(wc -l < "${ISSUES_FILE}" 2>/dev/null || echo 0)"

# Always email on Sundays (weekly full report), or when there are issues
SHOULD_EMAIL="false"
[[ "${ISSUE_COUNT}" -gt 0 ]] && SHOULD_EMAIL="true"
[[ "${DOW}" == "7" ]]         && SHOULD_EMAIL="true"   # Sunday = weekly report

if [[ "${SHOULD_EMAIL}" == "true" ]]; then
    if [[ "${ISSUE_COUNT}" -gt 0 ]]; then
        SUBJECT="[ALERT] ${ISSUE_COUNT} security issue(s) on ${HOST} — ${DATE}"
    else
        SUBJECT="[OK] Weekly security report — ${HOST} — ${DATE}"
    fi

    # Compose email: always send summary + issues at top, full report appended
    {
        echo "Host:   ${HOST}"
        echo "Date:   ${DATE} ${TIME}"
        echo "Issues: ${ISSUE_COUNT}"
        echo
        if [[ "${ISSUE_COUNT}" -gt 0 ]]; then
            echo "══ ISSUES FOUND ══════════════════════════════════════"
            cat "${ISSUES_FILE}"
            echo
        fi
        echo "══ FULL REPORT ══════════════════════════════════════"
        cat "${REPORT_FILE}"
    } | msmtp \
        --from="${SMTP_FROM}" \
        --subject="${SUBJECT}" \
        "${ALERT_EMAIL}" 2>/dev/null || \
    echo "[$(date)] Email send failed — check /etc/msmtprc" >> /var/log/security/email-errors.log
fi

# Clean up reports older than 30 days
find "${REPORT_DIR}" -name "scan-*.log" -mtime +30 -delete 2>/dev/null || true
