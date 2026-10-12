/**
 * GIP MASTERCLASS — MENTOR ADMIN MANAGEMENT ENGINE
 * Dedicated Mentor Console for: abdulhadipro47@gmail.com
 * Supports: Dynamic Admin Email Authorization (Full Access), Mobile & PC Views,
 * 1-Click Key Gen, Device Hardware Reset & WhatsApp Text Generator
 */

(function () {
    'use strict';

    const MASTER_ADMIN_EMAIL = 'abdulhadipro47@gmail.com';
    const DEFAULT_ADMIN_PASS = 'hadi786';

    // Storage Keys
    const STORAGE_KEY_PASS = 'gip_mentor_password';
    const STORAGE_KEY_LICENSES = 'gip_issued_licenses';
    const STORAGE_KEY_MENTOR_EMAIL = 'gip_mentor_authorized_email';
    const STORAGE_KEY_AUTHORIZED_ADMINS = 'gip_authorized_admin_emails';

    // Get authorized admin emails list
    function getAuthorizedAdminEmails() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_AUTHORIZED_ADMINS);
            if (raw) {
                let list = JSON.parse(raw);
                if (Array.isArray(list) && list.length > 0) {
                    list = list.map(item => {
                        if (typeof item === 'string') {
                            const isM = item.trim().toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
                            return {
                                email: item.trim().toLowerCase(),
                                role: isM ? 'Master Super Admin' : 'Admin (Full Access)',
                                addedAt: isM ? 'Permanent' : 'Active',
                                isMaster: isM
                            };
                        }
                        const isM = item.email.trim().toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
                        return {
                            ...item,
                            email: item.email.trim().toLowerCase(),
                            isMaster: isM
                        };
                    });

                    // Ensure Master Admin is present and at the start
                    const hasMaster = list.some(item => item.email === MASTER_ADMIN_EMAIL.toLowerCase());
                    if (!hasMaster) {
                        list.unshift({
                            email: MASTER_ADMIN_EMAIL.toLowerCase(),
                            role: 'Master Super Admin',
                            addedAt: 'Permanent',
                            isMaster: true
                        });
                    }
                    return list;
                }
            }
        } catch (e) {
            console.error(e);
        }

        const defaults = [
            {
                email: MASTER_ADMIN_EMAIL.toLowerCase(),
                role: 'Master Super Admin',
                addedAt: 'Permanent',
                isMaster: true
            }
        ];
        localStorage.setItem(STORAGE_KEY_AUTHORIZED_ADMINS, JSON.stringify(defaults));
        return defaults;
    }

    function saveAuthorizedAdminEmails(list) {
        localStorage.setItem(STORAGE_KEY_AUTHORIZED_ADMINS, JSON.stringify(list));
    }

    function isEmailAuthorized(email) {
        if (!email) return false;
        const clean = email.trim().toLowerCase();
        if (clean === MASTER_ADMIN_EMAIL.toLowerCase()) return true;
        const list = getAuthorizedAdminEmails();
        return list.some(item => item.email.toLowerCase() === clean);
    }

    function buildAdminInviteUrl(email) {
        const origin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : '';
        const path = window.location.pathname || '/';
        return `${origin}${path}?admin=${encodeURIComponent(email)}`;
    }

    // Initial Sample Seed if empty
    function getStoredLicenses() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_LICENSES);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error(e);
        }

        const defaults = [
            {
                id: 'lic_1',
                key: 'GIP-7842-AX',
                name: 'Muhammad Usman',
                whatsapp: '+92 300 1234567',
                createdAt: new Date().toLocaleDateString('en-GB'),
                active: true,
                boundDevice: null,
                boundDeviceName: null,
                boundEmail: null,
                boundPassword: null,
                boundAt: null
            },
            {
                id: 'lic_2',
                key: 'GIP-3918-BT',
                name: 'Hamza Malik',
                whatsapp: '+92 321 9876543',
                createdAt: new Date().toLocaleDateString('en-GB'),
                active: true,
                boundDevice: null,
                boundDeviceName: null,
                boundEmail: null,
                boundPassword: null,
                boundAt: null
            }
        ];
        localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(defaults));
        return defaults;
    }

    function saveLicenses(list) {
        localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(list));
    }

    function getAdminPassword() {
        return localStorage.getItem(STORAGE_KEY_PASS) || DEFAULT_ADMIN_PASS;
    }

    // Initialize UI Elements
    document.addEventListener('DOMContentLoaded', () => {
        const adminModal = document.getElementById('gip-admin-portal-modal');
        const closeAdminBtn = document.getElementById('close-admin-portal-btn');
        const headerAdminBtn = document.getElementById('btn-header-admin');
        const footerAdminBtn = document.getElementById('btn-footer-admin');
        const teleportAdminBtn = document.getElementById('teleport-admin-btn');

        // Views
        const loginView = document.getElementById('admin-login-view');
        const dashView = document.getElementById('admin-dashboard-view');

        // Login Controls
        const emailInput = document.getElementById('admin-login-email');
        const passInput = document.getElementById('admin-login-password');
        const submitLoginBtn = document.getElementById('btn-admin-login-submit');
        const loginErrorMsg = document.getElementById('admin-login-error');

        // Dash Controls
        const refreshBtn = document.getElementById('btn-admin-refresh');
        const searchInput = document.getElementById('admin-search-input');
        const licensesListEl = document.getElementById('admin-licenses-list');

        // Metrics
        const statTotal = document.getElementById('stat-total-licenses');
        const statBound = document.getElementById('stat-bound-licenses');
        const statActive = document.getElementById('stat-active-licenses');

        // Generator Controls
        const genNameInput = document.getElementById('new-student-name');
        const genWaInput = document.getElementById('new-student-whatsapp');
        const genCustomKeyInput = document.getElementById('new-custom-key');
        const btnGenKey = document.getElementById('btn-generate-key');
        const genOutputCard = document.getElementById('new-key-output-card');
        const genKeyText = document.getElementById('generated-key-text');
        const btnCopyInvite = document.getElementById('btn-copy-invite-msg');

        // Admin Email Management Controls
        const newAdminEmailInput = document.getElementById('new-admin-email');
        const btnAddAdminEmail = document.getElementById('btn-add-admin-email');
        const adminOutputCard = document.getElementById('new-admin-output-card');
        const adminLinkText = document.getElementById('new-admin-link-text');
        const btnCopyAdminInvite = document.getElementById('btn-copy-admin-invite');
        const btnCloseAdminOutput = document.getElementById('btn-close-admin-output');
        const authorizedAdminsListEl = document.getElementById('authorized-admins-list');

        let lastGeneratedMessage = '';
        let lastGeneratedAdminInviteMsg = '';

        // STRICT EMAIL VISIBILITY CHECK:
        // Visible ONLY when the current visitor's email matches an authorized admin
        // Simple visitor or unauthorized email: 100% HIDDEN
        function checkMentorAuthorization() {
            // 1. Check if visitor arrived via 1-click admin access link (?admin=email)
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const incomingEmail = (urlParams.get('admin') || urlParams.get('admin_access') || urlParams.get('mentor') || '').trim().toLowerCase();
                if (incomingEmail && incomingEmail.includes('@')) {
                    const list = getAuthorizedAdminEmails();
                    if (!list.some(item => item.email.toLowerCase() === incomingEmail)) {
                        list.push({
                            email: incomingEmail,
                            role: 'Admin (Full Access)',
                            addedAt: new Date().toLocaleDateString('en-GB'),
                            isMaster: false
                        });
                        saveAuthorizedAdminEmails(list);
                    }
                    localStorage.setItem(STORAGE_KEY_MENTOR_EMAIL, incomingEmail);

                    // Clean the URL parameter without page reload
                    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
                }
            } catch (e) {
                console.error(e);
            }

            // 2. Localhost auto-authorization for local development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const current = (localStorage.getItem(STORAGE_KEY_MENTOR_EMAIL) || '').trim().toLowerCase();
                if (!current || !isEmailAuthorized(current)) {
                    localStorage.setItem(STORAGE_KEY_MENTOR_EMAIL, MASTER_ADMIN_EMAIL);
                }
            }

            // 3. Toggle mentor mode visibility on body
            const currentEmail = (localStorage.getItem(STORAGE_KEY_MENTOR_EMAIL) || '').trim().toLowerCase();

            if (isEmailAuthorized(currentEmail)) {
                document.body.classList.add('mentor-mode-active');
            } else {
                document.body.classList.remove('mentor-mode-active');
            }
        }

        // Initialize visibility on load
        checkMentorAuthorization();

        // Open Modal - ALWAYS requires entering credentials afresh
        const openAdminModal = () => {
            if (!adminModal) return;
            adminModal.classList.add('active');

            // Close teleport popover if open
            const teleportPopover = document.getElementById('quick-teleport-popover');
            if (teleportPopover) teleportPopover.classList.remove('active');

            // Always show clean login screen, never auto-bypass
            showLogin();
        };

        const closeAdminModal = () => {
            if (adminModal) adminModal.classList.remove('active');
            // Immediately clear inputs and error state for security
            if (emailInput) emailInput.value = '';
            if (passInput) passInput.value = '';
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        };

        if (headerAdminBtn) headerAdminBtn.addEventListener('click', openAdminModal);
        if (footerAdminBtn) footerAdminBtn.addEventListener('click', openAdminModal);
        if (teleportAdminBtn) teleportAdminBtn.addEventListener('click', openAdminModal);
        if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminModal);

        if (adminModal) {
            adminModal.addEventListener('click', (e) => {
                if (e.target === adminModal) closeAdminModal();
            });
        }

        // Clean SVG Icons for Password Visibility Toggle
        const EYE_OPEN_SVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const EYE_OFF_SVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

        function resetEyeIcon() {
            if (togglePassBtn) {
                togglePassBtn.innerHTML = EYE_OPEN_SVG;
                togglePassBtn.setAttribute('title', 'Show password');
            }
        }

        // Show Login Screen - completely blank inputs, no auto-fill
        function showLogin() {
            if (loginView) loginView.style.display = 'block';
            if (dashView) dashView.style.display = 'none';
            if (emailInput) {
                emailInput.value = '';
                emailInput.placeholder = 'Enter Mentor Email';
            }
            if (passInput) {
                passInput.value = '';
                passInput.type = 'password';
            }
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';
            resetEyeIcon();
            setTimeout(() => {
                if (emailInput) emailInput.focus();
            }, 80);
        }

        // Show Dashboard Screen
        function showDashboard() {
            if (loginView) loginView.style.display = 'none';
            if (dashView) dashView.style.display = 'block';

            const activeEmailEl = document.getElementById('admin-current-active-email');
            const currentEmail = (localStorage.getItem(STORAGE_KEY_MENTOR_EMAIL) || MASTER_ADMIN_EMAIL).trim();
            if (activeEmailEl) {
                activeEmailEl.textContent = currentEmail;
            }

            renderDashboard();
        }

        // Show/Hide Password Toggle (Clean SVG)
        const togglePassBtn = document.getElementById('btn-toggle-admin-pass');
        if (togglePassBtn && passInput) {
            togglePassBtn.innerHTML = EYE_OPEN_SVG;
            togglePassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (passInput.type === 'password') {
                    passInput.type = 'text';
                    togglePassBtn.innerHTML = EYE_OFF_SVG;
                    togglePassBtn.setAttribute('title', 'Hide password');
                } else {
                    passInput.type = 'password';
                    togglePassBtn.innerHTML = EYE_OPEN_SVG;
                    togglePassBtn.setAttribute('title', 'Show password');
                }
            });
        }

        // Handle Login Submission
        if (submitLoginBtn) {
            submitLoginBtn.addEventListener('click', handleLogin);
        }
        if (passInput) {
            passInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleLogin();
            });
        }
        if (emailInput) {
            emailInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (passInput && !passInput.value) {
                        passInput.focus();
                    } else {
                        handleLogin();
                    }
                }
            });
        }

        function handleLogin() {
            const enteredEmail = (emailInput?.value || '').trim().toLowerCase();
            const enteredPass = (passInput?.value || '').trim();

            if (!enteredEmail) {
                showLoginError('⚠️ Please enter Admin / Mentor Email.');
                if (emailInput) emailInput.focus();
                return;
            }

            if (!isEmailAuthorized(enteredEmail)) {
                showLoginError('❌ Unauthorized Email. You do not have admin access.');
                return;
            }

            if (!enteredPass) {
                showLoginError('⚠️ Please enter Admin Password / PIN.');
                if (passInput) passInput.focus();
                return;
            }

            const currentPass = (getAdminPassword() || '').trim().toLowerCase();
            const cleanPass = enteredPass.toLowerCase();

            // Accept valid variations of the password (case-insensitive)
            const isMatch = (cleanPass === DEFAULT_ADMIN_PASS.toLowerCase()) ||
                            (cleanPass === 'hadi786') ||
                            (cleanPass === 'hadi') ||
                            (cleanPass === currentPass);

            if (!isMatch) {
                showLoginError('❌ Incorrect Admin Password / PIN.');
                return;
            }

            // Always sync default master password in storage
            localStorage.setItem(STORAGE_KEY_PASS, DEFAULT_ADMIN_PASS);
            localStorage.setItem(STORAGE_KEY_MENTOR_EMAIL, enteredEmail);
            document.body.classList.add('mentor-mode-active');

            // Success
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';
            showDashboard();
        }

        function showLoginError(msg) {
            if (loginErrorMsg) {
                loginErrorMsg.textContent = msg;
                loginErrorMsg.style.display = 'block';
            }
        }

        // Refresh List
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                renderDashboard();
                showAdminToast('✓ Dashboard refreshed!');
            });
        }

        // Search Filter
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.trim().toLowerCase();
                renderLicenses(query);
            });
        }

        // Render Dashboard Stats and List
        function renderDashboard() {
            const licenses = getStoredLicenses();

            // Stats
            if (statTotal) statTotal.textContent = licenses.length;
            if (statBound) statBound.textContent = licenses.filter(l => l.boundDevice).length;
            if (statActive) statActive.textContent = licenses.filter(l => l.active).length;

            renderAuthorizedAdminsList();
            renderLicenses(searchInput?.value.trim().toLowerCase() || '');
        }

        // Render Authorized Admins List
        function renderAuthorizedAdminsList() {
            if (!authorizedAdminsListEl) return;
            const list = getAuthorizedAdminEmails();

            if (list.length === 0) {
                authorizedAdminsListEl.innerHTML = `<div style="text-align:center; color:#9ca3af; font-size:12px; padding:10px;">No authorized admins.</div>`;
                return;
            }

            let html = '';
            list.forEach(admin => {
                const isMaster = admin.isMaster || admin.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
                const roleBadge = isMaster
                    ? `<span class="admin-role-badge-master">👑 Master Super Admin</span>`
                    : `<span class="admin-role-badge-co">⚡ Admin • Full Access</span>`;

                html += `
                    <div class="admin-email-item ${isMaster ? 'is-master' : ''}">
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 3px;">
                                <strong style="font-size: 13.5px; color: var(--text-primary); word-break: break-all;">📧 ${admin.email}</strong>
                                ${roleBadge}
                            </div>
                            <div style="font-size: 11.5px; color: #9ca3af;">
                                ${isMaster ? 'Permanent Owner • Protected' : `Added: ${admin.addedAt || 'Active'}`}
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                            <button type="button" class="btn-admin-action copy btn-copy-admin-link" data-email="${admin.email}" title="Copy 1-Click Access Link for this admin">
                                🔗 Link
                            </button>
                            ${!isMaster ? `
                                <button type="button" class="btn-admin-action delete btn-remove-admin-email" data-email="${admin.email}" title="Revoke Admin Access">
                                    🗑️
                                </button>
                            ` : `
                                <span style="font-size: 11px; color: #b45309; font-weight: 700; padding: 0 4px;">Protected</span>
                            `}
                        </div>
                    </div>
                `;
            });

            authorizedAdminsListEl.innerHTML = html;

            // Attach listeners
            authorizedAdminsListEl.querySelectorAll('.btn-copy-admin-link').forEach(btn => {
                btn.addEventListener('click', () => {
                    const email = btn.getAttribute('data-email');
                    const link = buildAdminInviteUrl(email);
                    const msg = `Salam!\n\nTikTok GIP Masterclass Admin Access Link:\n${link}\n\n🔑 Login with Email: ${email}\nPassword: ${DEFAULT_ADMIN_PASS}\n\nIs link ko apne mobile ya PC browser me open karein, Admin Panel active ho jayega! 🚀`;
                    navigator.clipboard.writeText(msg).then(() => {
                        showAdminToast(`✓ Access link copied for ${email}!`);
                    }).catch(() => {
                        prompt('Admin Link:', link);
                    });
                });
            });

            authorizedAdminsListEl.querySelectorAll('.btn-remove-admin-email').forEach(btn => {
                btn.addEventListener('click', () => {
                    const email = btn.getAttribute('data-email');
                    if (confirm(`Are you sure you want to revoke Admin access for ${email}? They will no longer see or access the Admin Panel.`)) {
                        let currentList = getAuthorizedAdminEmails();
                        currentList = currentList.filter(item => item.email.toLowerCase() !== email.toLowerCase());
                        saveAuthorizedAdminEmails(currentList);

                        // If currently active email was this one, reset to Master
                        const active = (localStorage.getItem(STORAGE_KEY_MENTOR_EMAIL) || '').trim().toLowerCase();
                        if (active === email.toLowerCase()) {
                            localStorage.setItem(STORAGE_KEY_MENTOR_EMAIL, MASTER_ADMIN_EMAIL);
                        }

                        renderAuthorizedAdminsList();
                        showAdminToast(`✓ Admin access revoked for ${email}.`);
                    }
                });
            });
        }

        // Add New Admin Email Handler
        if (btnAddAdminEmail) {
            btnAddAdminEmail.addEventListener('click', () => {
                const email = (newAdminEmailInput?.value || '').trim().toLowerCase();

                if (!email) {
                    alert('Please enter an email address.');
                    if (newAdminEmailInput) newAdminEmailInput.focus();
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address (e.g. partner@gmail.com).');
                    if (newAdminEmailInput) newAdminEmailInput.focus();
                    return;
                }

                const list = getAuthorizedAdminEmails();
                if (list.some(item => item.email.toLowerCase() === email)) {
                    alert(`Email "${email}" is already in the authorized admin list!`);
                    return;
                }

                list.push({
                    email: email,
                    role: 'Admin (Full Access)',
                    addedAt: new Date().toLocaleDateString('en-GB'),
                    isMaster: false
                });
                saveAuthorizedAdminEmails(list);

                const inviteUrl = buildAdminInviteUrl(email);
                lastGeneratedAdminInviteMsg = `Salam!\n\nAapko TikTok GIP Masterclass Portal par Mentor / Admin ka Full Access de diya gaya hai.\n\n🔗 Admin 1-Click Access Link:\n${inviteUrl}\n\n🔑 Admin Login Details:\n• Email: ${email}\n• Password: ${DEFAULT_ADMIN_PASS}\n\nIs link ko apne browser me open karein, Admin button show ho jayega aur full access mil jayega! 🚀`;

                if (adminLinkText) adminLinkText.textContent = inviteUrl;
                if (adminOutputCard) adminOutputCard.style.display = 'block';

                if (newAdminEmailInput) newAdminEmailInput.value = '';

                renderAuthorizedAdminsList();
                showAdminToast(`🎉 Admin email "${email}" added with full access!`);
            });
        }

        if (newAdminEmailInput) {
            newAdminEmailInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (btnAddAdminEmail) btnAddAdminEmail.click();
                }
            });
        }

        if (btnCopyAdminInvite) {
            btnCopyAdminInvite.addEventListener('click', () => {
                if (!lastGeneratedAdminInviteMsg) return;
                navigator.clipboard.writeText(lastGeneratedAdminInviteMsg).then(() => {
                    const orig = btnCopyAdminInvite.innerHTML;
                    btnCopyAdminInvite.innerHTML = '<span>✅ Copied WhatsApp Invite Message!</span>';
                    setTimeout(() => {
                        btnCopyAdminInvite.innerHTML = orig;
                    }, 2200);
                }).catch(() => {
                    alert(lastGeneratedAdminInviteMsg);
                });
            });
        }

        if (btnCloseAdminOutput) {
            btnCloseAdminOutput.addEventListener('click', () => {
                if (adminOutputCard) adminOutputCard.style.display = 'none';
            });
        }

        function renderLicenses(filterQuery) {
            if (!licensesListEl) return;
            const licenses = getStoredLicenses();

            const filtered = licenses.filter(lic => {
                if (!filterQuery) return true;
                const matchName = (lic.name || '').toLowerCase().includes(filterQuery);
                const matchKey = (lic.key || '').toLowerCase().includes(filterQuery);
                const matchWa = (lic.whatsapp || '').toLowerCase().includes(filterQuery);
                return matchName || matchKey || matchWa;
            });

            if (filtered.length === 0) {
                licensesListEl.innerHTML = `
                    <div style="text-align: center; color: #888; padding: 24px; font-size: 13px;">
                        No student licenses found matching your search.
                    </div>
                `;
                return;
            }

            let html = '';
            filtered.forEach(lic => {
                const isBound = !!lic.boundDevice;
                const statusBadge = isBound
                    ? `<span class="lic-badge-bound">🔒 Locked (${lic.boundDevice})</span>`
                    : `<span class="lic-badge-open">🟡 Open (No Device Bound)</span>`;

                const activeBadge = lic.active
                    ? `<span style="font-size: 11px; color: #059669; font-weight: 700;">Active</span>`
                    : `<span style="font-size: 11px; color: #e11d48; font-weight: 700;">Disabled</span>`;

                html += `
                    <div class="admin-license-item ${!lic.active ? 'inactive' : ''}" data-id="${lic.id}">
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
                                <span class="lic-key-tag">${lic.key}</span>
                                ${statusBadge}
                                ${activeBadge}
                            </div>
                            <div class="lic-student-details">
                                <strong>👤 ${lic.name || 'Unnamed Student'}</strong>
                                ${lic.boundEmail ? ` • 📧 <strong style="color:var(--brand-primary);">${lic.boundEmail}</strong>` : ''}
                                ${lic.boundDeviceName ? ` • 💻 <span style="color:#059669; font-weight:700;">${lic.boundDeviceName}</span>` : ''}
                                ${lic.whatsapp ? ` • 📱 <a href="https://wa.me/${lic.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" style="color: #059669; text-decoration: none; font-weight: 600;">${lic.whatsapp}</a>` : ''}
                                <span style="color: #9ca3af;"> • Issued: ${lic.createdAt}</span>
                            </div>
                        </div>
                        <div class="lic-actions-right">
                            ${isBound ? `
                                <button type="button" class="btn-lic-action reset" data-action="reset" data-id="${lic.id}" title="Reset device fingerprint lock if student changes mobile">
                                    🔄 Reset Device
                                </button>
                            ` : `
                                <span style="font-size: 11.5px; color: #9ca3af; padding: 0 4px;">Unbound</span>
                            `}
                            <button type="button" class="btn-lic-action toggle" data-action="toggle" data-id="${lic.id}" title="${lic.active ? 'Disable Key' : 'Enable Key'}">
                                ${lic.active ? 'Disable' : 'Enable'}
                            </button>
                            <button type="button" class="btn-lic-action delete" data-action="delete" data-id="${lic.id}" title="Delete Key">
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            });

            licensesListEl.innerHTML = html;

            // Attach event listeners for dynamic action buttons
            licensesListEl.querySelectorAll('.btn-lic-action').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = btn.getAttribute('data-action');
                    const id = btn.getAttribute('data-id');
                    handleLicenseAction(action, id);
                });
            });
        }

        // License Action Handler
        function handleLicenseAction(action, id) {
            const licenses = getStoredLicenses();
            const target = licenses.find(l => l.id === id);
            if (!target) return;

            if (action === 'reset') {
                target.boundDevice = null;
                target.boundDeviceName = null;
                target.boundAt = null;
                saveLicenses(licenses);
                renderDashboard();
                showAdminToast(`✓ Device lock reset for ${target.name || target.key}! Student can now bind a new device.`);
            } else if (action === 'toggle') {
                target.active = !target.active;
                saveLicenses(licenses);
                renderDashboard();
                showAdminToast(`✓ License ${target.key} is now ${target.active ? 'ACTIVE' : 'DISABLED'}.`);
            } else if (action === 'delete') {
                if (confirm(`Are you sure you want to delete access key ${target.key} for ${target.name}?`)) {
                    const updated = licenses.filter(l => l.id !== id);
                    saveLicenses(updated);
                    renderDashboard();
                    showAdminToast(`✓ License ${target.key} deleted.`);
                }
            }
        }

        // Key Generator
        if (btnGenKey) {
            btnGenKey.addEventListener('click', () => {
                const name = (genNameInput?.value || '').trim();
                const wa = (genWaInput?.value || '').trim();
                let customKey = (genCustomKeyInput?.value || '').trim().toUpperCase();

                if (!name) {
                    alert('Please enter student name.');
                    if (genNameInput) genNameInput.focus();
                    return;
                }

                let finalKey = customKey;
                if (!finalKey) {
                    const rand4_1 = Math.floor(1000 + Math.random() * 9000);
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
                    const rand2 = chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
                    finalKey = `GIP-${rand4_1}-${rand2}`;
                }

                const newLicense = {
                    id: 'lic_' + Date.now(),
                    key: finalKey,
                    name: name,
                    whatsapp: wa,
                    createdAt: new Date().toLocaleDateString('en-GB'),
                    active: true,
                    boundDevice: null,
                    boundDeviceName: null,
                    boundEmail: null,
                    boundPassword: null,
                    boundAt: null
                };

                const licenses = getStoredLicenses();
                licenses.unshift(newLicense);
                saveLicenses(licenses);

                // Prepare WhatsApp Invite message
                lastGeneratedMessage = `Salam ${name}!\n\nWelcome to TikTok GIP Masterclass by Mentor Hadi Awan (abdulhadipro47@gmail.com).\n\nAapki official 1-Device Access Key yeh hai:\n🔑 Access Key: ${finalKey}\n🔗 Course Portal: ${window.location.origin || 'Website'}\n\n🔒 Note: Yeh key aapke pehle mobile ya PC device ke sath bind ho jayegi. Kisi doosre ke sath share mat karein.\n\nGood luck with your GIP RPM journey! 🚀`;

                if (genKeyText) genKeyText.textContent = finalKey;
                if (genOutputCard) genOutputCard.style.display = 'block';

                // Clear input fields
                if (genNameInput) genNameInput.value = '';
                if (genWaInput) genWaInput.value = '';
                if (genCustomKeyInput) genCustomKeyInput.value = '';

                renderDashboard();
                showAdminToast(`🎉 New key ${finalKey} issued for ${name}!`);
            });
        }

        // Copy WhatsApp invite message button
        if (btnCopyInvite) {
            btnCopyInvite.addEventListener('click', () => {
                if (!lastGeneratedMessage) return;
                navigator.clipboard.writeText(lastGeneratedMessage).then(() => {
                    const orig = btnCopyInvite.innerHTML;
                    btnCopyInvite.innerHTML = '<span>✅ Copied to Clipboard!</span>';
                    setTimeout(() => {
                        btnCopyInvite.innerHTML = orig;
                    }, 2200);
                }).catch(() => {
                    alert(lastGeneratedMessage);
                });
            });
        }

        // Toast feedback
        function showAdminToast(msg) {
            let toast = document.getElementById('gip-admin-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'gip-admin-toast';
                toast.style.position = 'fixed';
                toast.style.bottom = '24px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.background = '#111827';
                toast.style.color = '#ffffff';
                toast.style.padding = '10px 20px';
                toast.style.borderRadius = '999px';
                toast.style.fontSize = '13px';
                toast.style.fontWeight = '700';
                toast.style.zIndex = '999999';
                toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(10px)';
            }, 3000);
        }
    });
})();
