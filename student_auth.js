/**
 * GIP MASTERCLASS — STUDENT AUTHENTICATION & 1-DEVICE HARDWARE LOCK ENGINE
 * Enforces: Gmail + Password + Student Key Verification
 * Hardware Fingerprint Binding: 1 Key = 1 Device permanently.
 * Sharing prevention: If key, gmail or password is shared, other devices are completely blocked.
 */

(function () {
    'use strict';

    const STORAGE_KEY_LICENSES = 'gip_issued_licenses';
    const STORAGE_KEY_STUDENT_SESSION = 'gip_student_session';
    const STORAGE_KEY_MENTOR_EMAIL = 'gip_mentor_authorized_email';

    // 1. Generate Deterministic Hardware Device Fingerprint
    function generateDeviceFingerprint() {
        const screenData = `${screen.width}x${screen.height}x${screen.colorDepth}x${window.devicePixelRatio || 1}`;
        const cores = navigator.hardwareConcurrency || 2;
        const ram = navigator.deviceMemory || 4;
        const platform = navigator.platform || 'unknown';
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const touch = ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'touch' : 'no_touch';

        let canvasHash = 'cv_standard';
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = '#7c3aed';
                ctx.fillRect(10, 1, 62, 20);
                ctx.fillStyle = '#059669';
                ctx.fillText('GIP-HW-LOCK', 2, 15);
                ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
                ctx.fillText('GIP-HW-LOCK', 4, 17);
                canvasHash = canvas.toDataURL().slice(-40);
            }
        } catch (e) {}

        let glRenderer = 'gl_standard';
        try {
            const glCanvas = document.createElement('canvas');
            const gl = glCanvas.getContext('webgl') || glCanvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    glRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'gl_unk';
                }
            }
        } catch (e) {}

        const raw = `${screenData}|${cores}|${ram}|${platform}|${timezone}|${touch}|${canvasHash}|${glRenderer}`;

        // DJB2 hash variant
        let hash = 5381;
        for (let i = 0; i < raw.length; i++) {
            hash = ((hash << 5) + hash) + raw.charCodeAt(i);
            hash = hash & hash;
        }
        const hex = Math.abs(hash).toString(16).padStart(8, '0');
        return `DEV-${hex}`;
    }

    function getDeviceLabel() {
        const ua = navigator.userAgent;
        let os = "PC";
        if (/android/i.test(ua)) os = "Android Mobile";
        else if (/iPad|iPhone|iPod/.test(ua)) os = "iPhone / iOS";
        else if (/Macintosh|Mac OS X/.test(ua)) os = "Mac";
        else if (/Windows/i.test(ua)) os = "Windows PC";
        else if (/Linux/i.test(ua)) os = "Linux PC";
        return `${os} (${screen.width}x${screen.height})`;
    }

    function getStoredLicenses() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_LICENSES);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error(e);
        }
        return [];
    }

    function saveLicenses(list) {
        localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(list));
    }

    function getStudentSession() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_STUDENT_SESSION);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    function saveStudentSession(session) {
        localStorage.setItem(STORAGE_KEY_STUDENT_SESSION, JSON.stringify(session));
    }

    function clearStudentSession() {
        localStorage.removeItem(STORAGE_KEY_STUDENT_SESSION);
    }

    // Initialize Student Auth System
    document.addEventListener('DOMContentLoaded', () => {
        const gate = document.getElementById('student-login-gate');
        const form = document.getElementById('student-login-form');
        const emailInput = document.getElementById('student-login-email');
        const passInput = document.getElementById('student-login-password');
        const keyInput = document.getElementById('student-login-key');
        const submitBtn = document.getElementById('btn-student-login-submit');
        const errorEl = document.getElementById('student-login-error');
        const togglePassBtn = document.getElementById('btn-toggle-student-pass');
        const vipBadge = document.getElementById('vip-user-badge');
        const vipName = document.getElementById('vip-user-name');
        const logoutBtn = document.getElementById('btn-student-logout');
        const btnGateMentor = document.getElementById('btn-gate-open-mentor');

        // Check Mentor status
        function isMentorActive() {
            return document.body.classList.contains('mentor-mode-active') ||
                   localStorage.getItem(STORAGE_KEY_MENTOR_EMAIL) === 'abdulhadipro47@gmail.com';
        }

        // Check if student is already authenticated
        function verifyExistingSession() {
            // If already Mentor, auto-unlock
            if (isMentorActive()) {
                unlockWebsiteAsMentor();
                return;
            }

            const session = getStudentSession();
            if (!session) {
                lockWebsite();
                return;
            }

            // Verify hardware fingerprint matches the session
            const currentFingerprint = generateDeviceFingerprint();
            if (session.device && session.device !== currentFingerprint) {
                // Device fingerprint changed! Possible session copy
                clearStudentSession();
                lockWebsite();
                showError('🚫 Hardware mismatch detected. Please re-login on your registered device.');
                return;
            }

            // Check if key is still valid in licenses database
            const licenses = getStoredLicenses();
            const lic = licenses.find(l => (l.key || '').toUpperCase() === (session.key || '').toUpperCase());
            if (lic && !lic.active) {
                clearStudentSession();
                lockWebsite();
                showError('❌ Your student access has been deactivated by Mentor.');
                return;
            }

            // Valid active session
            unlockWebsite(session);
        }

        function lockWebsite() {
            document.body.classList.add('student-locked');
            if (gate) {
                gate.style.display = 'flex';
                setTimeout(() => gate.classList.add('active'), 10);
            }
            if (vipBadge) vipBadge.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }

        function unlockWebsite(session) {
            document.body.classList.remove('student-locked');
            if (gate) {
                gate.classList.remove('active');
                setTimeout(() => { gate.style.display = 'none'; }, 250);
            }
            if (vipBadge) {
                vipBadge.style.display = 'inline-flex';
                if (vipName) vipName.textContent = session.name || session.email.split('@')[0];
            }
            if (logoutBtn) logoutBtn.style.display = 'inline-flex';
        }

        function unlockWebsiteAsMentor() {
            document.body.classList.remove('student-locked');
            if (gate) {
                gate.classList.remove('active');
                gate.style.display = 'none';
            }
            if (vipBadge) {
                vipBadge.style.display = 'inline-flex';
                if (vipName) vipName.textContent = 'Mentor Hadi';
            }
        }

        function showError(msg) {
            if (errorEl) {
                errorEl.innerHTML = msg.replace(/\n/g, '<br>');
                errorEl.style.display = 'block';
            }
        }

        function hideError() {
            if (errorEl) {
                errorEl.style.display = 'none';
                errorEl.innerHTML = '';
            }
        }

        // Toggle Password Visibility (Clean SVG)
        const EYE_OPEN = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const EYE_OFF = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

        if (togglePassBtn && passInput) {
            togglePassBtn.innerHTML = EYE_OPEN;
            togglePassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (passInput.type === 'password') {
                    passInput.type = 'text';
                    togglePassBtn.innerHTML = EYE_OFF;
                } else {
                    passInput.type = 'password';
                    togglePassBtn.innerHTML = EYE_OPEN;
                }
            });
        }

        // Handle Login Submission
        function handleStudentLogin() {
            hideError();

            const email = (emailInput?.value || '').trim().toLowerCase();
            const pass = (passInput?.value || '').trim();
            const key = (keyInput?.value || '').trim().toUpperCase();

            // Validation
            if (!email) {
                showError('⚠️ Please enter your Gmail / Email address.');
                if (emailInput) emailInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('⚠️ Please enter a valid Gmail address (e.g. yourname@gmail.com).');
                if (emailInput) emailInput.focus();
                return;
            }

            if (!pass) {
                showError('⚠️ Please enter your Password.');
                if (passInput) passInput.focus();
                return;
            }

            if (!key) {
                showError('⚠️ Please enter your 1-Device Student Key.');
                if (keyInput) keyInput.focus();
                return;
            }

            const licenses = getStoredLicenses();
            const licIndex = licenses.findIndex(l => (l.key || '').toUpperCase() === key);

            if (licIndex === -1) {
                showError('❌ Invalid Student Key. Please enter a valid GIP Access Key issued by Mentor Hadi Awan.');
                return;
            }

            const license = licenses[licIndex];

            // Check if license is active
            if (!license.active) {
                showError('❌ This Student Access Key has been deactivated. Please contact Mentor Hadi Awan.');
                return;
            }

            const currentFingerprint = generateDeviceFingerprint();
            const currentDeviceLabel = getDeviceLabel();

            // STRICT 1-DEVICE HARDWARE LOCK LOGIC:
            if (license.boundDevice) {
                // CASE 1: Key is already bound to a device!
                if (license.boundDevice !== currentFingerprint) {
                    showError(`🚫 Hardware Lock Mismatch!
Yeh Student Key pehle hi kisi doosre device (${license.boundDeviceName || 'Active Device'}) ke sath bound hai.
1 Key sirf 1 Mobile/PC par login ho sakti hai.
Agar key share ki gayi hai to is device par access nahi milega!
Device change ke liye apne Mentor Hadi Awan se rabta karein taake wo lock reset karein.`);
                    return;
                }

                // Verify email matches bound email (if already registered)
                if (license.boundEmail && license.boundEmail.toLowerCase() !== email) {
                    showError('❌ Email Mismatch! Yeh Access Key kisi aur email ke sath registered hai.');
                    return;
                }

                // Verify password matches bound password (if already registered)
                if (license.boundPassword && license.boundPassword !== pass) {
                    showError('❌ Incorrect Password for this Student Account.');
                    return;
                }

                // If not previously saved email/password, save it
                if (!license.boundEmail) license.boundEmail = email;
                if (!license.boundPassword) license.boundPassword = pass;
                licenses[licIndex] = license;
                saveLicenses(licenses);
            } else {
                // CASE 2: Key is UNBOUND (First time student login):
                // Bind this key permanently to this hardware fingerprint, email, and password!
                license.boundDevice = currentFingerprint;
                license.boundDeviceName = currentDeviceLabel;
                license.boundEmail = email;
                license.boundPassword = pass;
                license.boundAt = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

                if (!license.name || license.name === 'Unnamed Student') {
                    license.name = email.split('@')[0];
                }

                licenses[licIndex] = license;
                saveLicenses(licenses);
            }

            // Create active student session
            const session = {
                key: license.key,
                name: license.name || email.split('@')[0],
                email: email,
                device: currentFingerprint,
                deviceName: currentDeviceLabel,
                loginAt: new Date().toISOString()
            };
            saveStudentSession(session);

            // Unlock the website
            unlockWebsite(session);

            // Show welcome toast
            showToast(`🎉 Welcome ${session.name}! GIP Masterclass unlocked.`);
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleStudentLogin();
            });
        }
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleStudentLogin();
            });
        }

        // Student Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to log out of GIP Masterclass?')) {
                    clearStudentSession();
                    lockWebsite();
                    if (emailInput) emailInput.value = '';
                    if (passInput) passInput.value = '';
                    if (keyInput) keyInput.value = '';
                    hideError();
                    showToast('✓ Successfully logged out.');
                }
            });
        }

        // Mentor Trigger from Gate
        if (btnGateMentor) {
            btnGateMentor.addEventListener('click', () => {
                const adminModal = document.getElementById('gip-admin-portal-modal');
                if (adminModal) {
                    adminModal.classList.add('active');
                    const loginView = document.getElementById('admin-login-view');
                    const dashView = document.getElementById('admin-dashboard-view');
                    if (loginView) loginView.style.display = 'block';
                    if (dashView) dashView.style.display = 'none';
                }
            });
        }

        function showToast(msg) {
            let toast = document.getElementById('gip-student-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'gip-student-toast';
                toast.style.position = 'fixed';
                toast.style.top = '24px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.background = '#111827';
                toast.style.color = '#ffffff';
                toast.style.padding = '10px 20px';
                toast.style.borderRadius = '999px';
                toast.style.fontSize = '13.5px';
                toast.style.fontWeight = '700';
                toast.style.zIndex = '9999999';
                toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                toast.style.transition = 'all 0.3s ease';
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-10px)';
            }, 3200);
        }

        // Run verification on load
        verifyExistingSession();
    });
})();
