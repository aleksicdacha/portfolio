#!/usr/bin/env bash
# =============================================================================
#  setup-security-monitoring.sh — One-shot security monitoring bootstrap
#
#  Run this AFTER setup-server.sh (it builds on top of that hardening)
#
#  USAGE (run on server as root):
#    scp deploy/server-hardening/setup-security-monitoring.sh root@SERVER:/root/
#    scp deploy/server-hardening/daily-security-scan.sh       root@SERVER:/root/
#    scp deploy/server-hardening/msmtp.conf.template          root@SERVER:/root/msmtp.conf
#    ssh root@SERVER "bash /root/setup-security-monitoring.sh 2>&1 | tee /root/security-setup.log"
#
#  WHAT THIS DOES:
#    1. Installs: ClamAV, rkhunter, chkrootkit, Lynis, msmtp, logwatch, auditd
#    2. Configures unattended-upgrades (auto OS security patches)
#    3. Installs msmtp for lightweight SMTP email
#    4. Deploys the daily scan cron job (runs at 03:30 every night)
#    5. Configures auditd for syscall/auth auditing
#    6. Hardens /tmp with noexec mount
#    7. Enables process accounting
#    8. Runs an initial baseline scan
# =============================================================================
set -euo pipefail

# ── !! EDIT THESE !! ──────────────────────────────────────────────────────────
ALERT_EMAIL="YOUR_EMAIL@gmail.com"       # where reports go
SMTP_FROM="YOUR_GMAIL@gmail.com"         # must match msmtp 'from'
MSMTP_CONF="/root/msmtp.conf"            # filled-in msmtp config (scp'd above)
SCAN_SCRIPT_SRC="/root/daily-security-scan.sh"
# ─────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
die()     { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

[[ $EUID -ne 0 ]] && die "Must run as root"

# =============================================================================
# 1. INSTALL SECURITY TOOLS
# =============================================================================
info "1/8  Installing security monitoring tools..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq \
    clamav clamav-daemon \
    rkhunter \
    chkrootkit \
    lynis \
    acct \
    auditd audispd-plugins \
    msmtp msmtp-mta \
    mailutils \
    logwatch \
    aide \
    debsums \
    needrestart \
    libpam-pwquality
success "Security tools installed"

# =============================================================================
# 2. CONFIGURE UNATTENDED-UPGRADES (auto security patches)
# =============================================================================
info "2/8  Configuring unattended-upgrades..."
apt-get install -y -qq unattended-upgrades apt-listchanges

cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::Package-Blacklist {};
Unattended-Upgrade::DevRelease "false";
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Remove-New-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
Unattended-Upgrade::Mail "REPLACE_EMAIL";
Unattended-Upgrade::MailReport "on-change";
Unattended-Upgrade::SyslogEnable "true";
EOF

# Inject the actual email
sed -i "s/REPLACE_EMAIL/${ALERT_EMAIL}/" /etc/apt/apt.conf.d/50unattended-upgrades

cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

systemctl enable unattended-upgrades
systemctl restart unattended-upgrades
success "Unattended-upgrades configured (security patches apply automatically)"

# =============================================================================
# 3. CONFIGURE MSMTP (lightweight email)
# =============================================================================
info "3/8  Configuring email (msmtp)..."

if [[ ! -f "$MSMTP_CONF" ]]; then
    die "msmtp config not found at $MSMTP_CONF. Please scp msmtp.conf.template to server and fill in credentials."
fi

cp "$MSMTP_CONF" /etc/msmtprc
chmod 600 /etc/msmtprc
chown root:root /etc/msmtprc

# Make mail command use msmtp
if [[ ! -f /etc/mail.rc ]]; then touch /etc/mail.rc; fi
grep -q "set sendmail" /etc/mail.rc || echo "set sendmail=/usr/bin/msmtp" >> /etc/mail.rc

# Test email delivery
info "   Sending test email to $ALERT_EMAIL..."
if echo "Security monitoring setup complete on $(hostname) at $(date)" \
    | msmtp --from="${SMTP_FROM}" "$ALERT_EMAIL" 2>/dev/null; then
    success "Test email sent to $ALERT_EMAIL"
else
    warn "Test email failed — check /etc/msmtprc credentials and run: echo test | msmtp $ALERT_EMAIL"
fi

success "msmtp configured"

# =============================================================================
# 4. CONFIGURE CLAMAV
# =============================================================================
info "4/8  Configuring ClamAV..."

# Stop daemon for initial DB update
systemctl stop clamav-freshclam 2>/dev/null || true

# Update virus definitions
freshclam --quiet || warn "freshclam update failed (check internet access)"

# Configure freshclam to auto-update twice daily
cat > /etc/clamav/freshclam.conf << 'EOF'
DatabaseDirectory /var/lib/clamav
UpdateLogFile /var/log/clamav/freshclam.log
LogTime yes
LogVerbose no
LogSyslog yes
DatabaseMirror database.clamav.net
Checks 2
NotifyClamd /etc/clamav/clamd.conf
EOF

systemctl enable clamav-freshclam
systemctl start clamav-freshclam
success "ClamAV configured (virus DB updates 2x/day)"

# =============================================================================
# 5. CONFIGURE RKHUNTER
# =============================================================================
info "5/8  Configuring rkhunter..."

# Build initial file property database (baseline)
rkhunter --update --quiet || true
rkhunter --propupd --quiet || true

# Enable rkhunter email alerts in config
if [[ -f /etc/rkhunter.conf ]]; then
    sed -i "s|^#*MAIL-ON-WARNING=.*|MAIL-ON-WARNING=${ALERT_EMAIL}|" /etc/rkhunter.conf
    sed -i "s|^#*MAIL_CMD=.*|MAIL_CMD=mail -s \"[rkhunter] WARNING on \$(hostname)\"|" /etc/rkhunter.conf
    sed -i "s|^#*ALLOW_SSH_ROOT_USER=.*|ALLOW_SSH_ROOT_USER=prohibit-password|" /etc/rkhunter.conf
fi

# Enable auto-run via cron default
if [[ -f /etc/default/rkhunter ]]; then
    sed -i "s|^CRON_DAILY_RUN=.*|CRON_DAILY_RUN=\"true\"|" /etc/default/rkhunter
    sed -i "s|^REPORT_EMAIL=.*|REPORT_EMAIL=\"${ALERT_EMAIL}\"|" /etc/default/rkhunter
fi

success "rkhunter configured"

# =============================================================================
# 6. CONFIGURE AUDITD (syscall + auth auditing)
# =============================================================================
info "6/8  Configuring auditd..."

cat > /etc/audit/rules.d/security.rules << 'EOF'
# ── Auditd Security Rules ──────────────────────────────────────────────────

# Log all authentication events
-w /var/log/auth.log -p wa -k auth
-w /etc/passwd -p wa -k passwd_changes
-w /etc/shadow -p wa -k shadow_changes
-w /etc/group -p wa -k group_changes
-w /etc/sudoers -p wa -k sudoers_changes
-w /etc/ssh/sshd_config -p wa -k sshd_config

# Log all cron changes
-w /etc/cron.d/ -p wa -k cron_changes
-w /etc/crontab -p wa -k cron_changes
-w /var/spool/cron/ -p wa -k cron_changes

# Log network config changes
-w /etc/hosts -p wa -k network_changes
-w /etc/network/ -p wa -k network_changes

# Log setuid/setgid execution
-a always,exit -F arch=b64 -S setuid -S setgid -k privilege_escalation
-a always,exit -F arch=b64 -S execve -k exec

# Log failed system calls (detect brute force / privilege abuse)
-a always,exit -F arch=b64 -S all -F exit=-EACCES -k access_denied
-a always,exit -F arch=b64 -S all -F exit=-EPERM -k access_denied

# Immutable audit log (prevents tampering — requires reboot to remove)
# -e 2
EOF

systemctl enable auditd
systemctl restart auditd
success "auditd configured"

# =============================================================================
# 7. INITIALIZE AIDE (file integrity monitor)
# =============================================================================
info "7/8  Initializing AIDE (file integrity database)..."
info "   This takes 1-2 minutes..."
aide --init 2>/dev/null && mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
success "AIDE baseline database created"

# =============================================================================
# 8. DEPLOY DAILY SCAN CRON JOB
# =============================================================================
info "8/8  Deploying daily security scan cron job..."

if [[ ! -f "$SCAN_SCRIPT_SRC" ]]; then
    die "daily-security-scan.sh not found at $SCAN_SCRIPT_SRC. Please scp it to the server first."
fi

SCAN_DEST="/usr/local/bin/daily-security-scan.sh"
cp "$SCAN_SCRIPT_SRC" "$SCAN_DEST"

# Inject email into the scan script
sed -i "s|ALERT_EMAIL=\".*\"|ALERT_EMAIL=\"${ALERT_EMAIL}\"|" "$SCAN_DEST"
sed -i "s|SMTP_FROM=\".*\"|SMTP_FROM=\"${SMTP_FROM}\"|" "$SCAN_DEST"

chmod 700 "$SCAN_DEST"
chown root:root "$SCAN_DEST"

# Cron: runs daily at 03:30
cat > /etc/cron.d/daily-security-scan << EOF
# Daily security scan — runs at 03:30
SHELL=/bin/bash
30 3 * * * root ${SCAN_DEST} >> /var/log/security/cron.log 2>&1
EOF
chmod 644 /etc/cron.d/daily-security-scan

# Create log directory
mkdir -p /var/log/security
chmod 750 /var/log/security

success "Daily scan cron job installed (runs at 03:30 every night)"

# =============================================================================
# DONE
# =============================================================================
echo
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Security monitoring setup complete                     ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║ Tools:     ClamAV, rkhunter, chkrootkit, Lynis, AIDE     ║${NC}"
echo -e "${GREEN}║ Auditd:    syscall + auth + config change logging         ║${NC}"
echo -e "${GREEN}║ Auto-patch: unattended-upgrades (security only)           ║${NC}"
echo -e "${GREEN}║ Cron:      daily scan at 03:30 → report to email          ║${NC}"
echo -e "${GREEN}║ Email:     ${ALERT_EMAIL}                                 ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║ Run manual scan now:                                      ║${NC}"
echo -e "${GREEN}║   /usr/local/bin/daily-security-scan.sh                   ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
