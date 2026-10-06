import re
from bs4 import BeautifulSoup

# Load backup HTML
with open('index.backup.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

main = soup.find('main')
header = main.find('header')
sections = main.find_all('section')

# Update Google Drive videos inside sections to clean "Open In Drive" cards (no iframe, no cinema mode, no stop button)
for s in sections:
    for ifr in s.find_all('iframe'):
        src = ifr.get('src', '')
        if '1h5QjKxsK_AeVVN02KCsNstSsTPVzGdZb' in src:
            # Lecture 2 in gip-explained (Lecture 03 in course)
            parent_wrapper = ifr.find_parent(class_='video-wrapper')
            if parent_wrapper:
                new_soup = BeautifulSoup("""
                <div class="drive-lecture-clean-card">
                    <div class="open-in-drive-hero-box" style="border-radius:var(--radius-lg); margin-bottom:0;">
                        <a href="https://drive.google.com/file/d/1h5QjKxsK_AeVVN02KCsNstSsTPVzGdZb/view" target="_blank" rel="noopener" class="btn-open-in-drive-action" title="Open video directly in Google Drive">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                            </svg>
                            <span>Open In Drive</span>
                        </a>
                    </div>
                </div>
                """, 'html.parser')
                parent_wrapper.replace_with(new_soup)
        elif '1FCdH7FQ9tM-M4enyLDBynQib3eamXvRX' in src:
            # Lecture 12 in problems-solutions
            parent_wrapper = ifr.find_parent(class_=['video-wrapper', 'pro-drive-container'])
            if parent_wrapper:
                new_soup = BeautifulSoup("""
                <div class="drive-lecture-clean-card">
                    <div class="open-in-drive-hero-box" style="border-radius:var(--radius-lg); margin-bottom:0;">
                        <a href="https://drive.google.com/file/d/1FCdH7FQ9tM-M4enyLDBynQib3eamXvRX/view" target="_blank" rel="noopener" class="btn-open-in-drive-action" title="Open video directly in Google Drive">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                            </svg>
                            <span>Open In Drive</span>
                        </a>
                    </div>
                </div>
                """, 'html.parser')
                parent_wrapper.replace_with(new_soup)

# Remove MediaFire download text from all APK/app resource cards
for s in sections:
    for sub in s.find_all(class_='resource-subtitle'):
        if 'mediafire' in sub.get_text().lower():
            sub.decompose()

sections_html = ""
for s in sections:
    sec_id = s.get('id', '')
    sections_html += f"""
    <section class="masterclass-section-block" id="{sec_id}">
        {s.decode_contents()}
    </section>
    """

full_html = f"""<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TIKTOK GIP MASTERCLASS — Complete Guide & Lectures by Hadi Awan</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="pro_theme.css?v=18.0">
</head>

<body>

    <!-- Ambient Subtle Warm Light at Top -->
    <div class="ambient-glow"></div>

    <!-- Sticky Pro Off-White Navigation Header -->
    <header class="pro-header">
        <nav class="pro-nav">
            <!-- Brand Badge -->
            <a href="#" class="brand-badge">
                <div class="brand-icon-box">GIP</div>
                <div class="brand-text-block">
                    <span class="brand-title">GIP Masterclass</span>
                    <span class="brand-subtitle">Pro Edition • Hadi Awan</span>
                </div>
            </a>

            <!-- Header Action Buttons (Visible on PC, hidden on mobile via CSS) -->
            <div class="header-actions">
                <button class="btn-pill-subtle btn-lang-switch" id="lang-toggle-btn" title="Toggle English / Roman English">
                    <span class="lang-icon">🌐</span>
                    <span id="lang-btn-text">Roman: <strong>OFF</strong></span>
                </button>
                <button class="btn-pill-subtle" id="open-notes-btn" title="Open My Study Notes">
                    <span>📝</span>
                    <span>Notes</span>
                </button>
                <a href="#gip-explained" class="btn-pill-primary">
                    <span>🎮 GIP Course</span>
                </a>
            </div>
        </nav>
    </header>

    <!-- Main Container -->
    <div class="page-container">

        <!-- Pro Editorial Hero Section -->
        <section class="pro-hero">
            <h1 class="pro-hero-title">
                <span class="hero-gradient-text" data-i18n="heroTitle">TikTok Gaming Incentive Program</span>
            </h1>

            <p class="pro-hero-subtitle" data-i18n="heroSubtitle">
                The definitive masterclass by Abdul Hadi. All 15 official video lectures, anti-ban mod APK downloads, day 1–7 account warmup protocol, and 1-click appeal templates.
            </p>

            <!-- Stats Metric Strip -->
            <div class="stats-strip-grid">
                <div class="stat-chip-card">
                    <div class="stat-number">15 Videos</div>
                    <div class="stat-label" data-i18n="statLectures">Complete Masterclass Lectures</div>
                </div>
                <div class="stat-chip-card">
                    <div class="stat-number">11 Sections</div>
                    <div class="stat-label" data-i18n="statBlueprint">Full Step-by-Step Blueprint</div>
                </div>
                <div class="stat-chip-card">
                    <div class="stat-number">$0.80 – $2.40</div>
                    <div class="stat-label" data-i18n="statRpm">Target Qualified RPM</div>
                </div>
                <div class="stat-chip-card">
                    <div class="stat-number">162 Students</div>
                    <div class="stat-label" data-i18n="statEnrolled">Active Creators Enrolled</div>
                </div>
            </div>
        </section>

        <!-- ====================================================================
             ALL 11 DETAILED MASTERCLASS SECTIONS WITH EMBEDDED LECTURE VIDEOS
             ==================================================================== -->
        <div class="all-sections-wrapper">
            {sections_html}
        </div>

        <!-- ====================================================================
             12. TIKTOK GIP RPM & EARNINGS CALCULATOR (STANDARD SECTION & CARD)
             ==================================================================== -->
        <section class="masterclass-section-block" id="rpm-calculator">
            <h2 class="section-title" data-i18n="calcTitle">TikTok GIP RPM &amp; Earnings Calculator</h2>
            <div class="card">
                <div class="calc-inputs-row">
                    <div class="calc-field">
                        <label for="calc-views" data-i18n="calcViewsLabel">Views</label>
                        <input type="number" id="calc-views" class="calc-input" value="100000" step="1000" min="0" placeholder="100000">
                    </div>

                    <div class="calc-field">
                        <label for="calc-rpm" data-i18n="calcRpmLabel">RPM ($)</label>
                        <input type="number" id="calc-rpm" class="calc-input" value="1.20" step="0.05" min="0" placeholder="1.20">
                    </div>
                </div>

                <div class="calc-output-box">
                    <span class="calc-output-label" data-i18n="calcPayoutLabel">Qualified Views Dollars Earning:</span>
                    <span class="calc-output-amount" id="calc-payout-display">$120.00</span>
                </div>
            </div>
        </section>

    <!-- Floating Fast Scroll Dock -->
    <aside class="fast-scroll-dock" id="fast-scroll-dock">
        <div class="dock-progress-ring" id="dock-progress-ring" title="Scroll Progress">
            <span id="dock-progress-text">0%</span>
        </div>

        <button type="button" class="dock-btn" id="dock-btn-top" title="Fast Scroll to Top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="18 15 12 9 6 15"/>
            </svg>
            <span class="dock-btn-label">Top</span>
        </button>

        <button type="button" class="dock-btn dock-btn-center" id="dock-btn-center" title="Jump to Center: GIP Explained">
            <span>🎮</span>
            <span class="dock-btn-label">Center</span>
        </button>

        <button type="button" class="dock-btn dock-btn-menu" id="dock-btn-jump-menu" title="Quick Section Teleport Menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span class="dock-btn-label">Sections</span>
        </button>

        <button type="button" class="dock-btn" id="dock-btn-bottom" title="Fast Scroll to Bottom">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
            <span class="dock-btn-label">Bottom</span>
        </button>
    </aside>

    <!-- Quick Section Teleport Menu Popover -->
    <div class="quick-teleport-popover" id="quick-teleport-popover">
        <div class="teleport-popover-header">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:18px;">⚡</span>
                <div>
                    <h4 style="margin:0; font-size:15px; font-weight:800; color:var(--text-primary);">Fast Jump Teleport</h4>
                    <span style="font-size:11.5px; color:var(--text-muted);">One-click instant navigation</span>
                </div>
            </div>
            <button type="button" class="teleport-close-btn" id="teleport-close-btn">&times;</button>
        </div>

        <div class="teleport-search-bar">
            <input type="text" id="teleport-search-input" placeholder="Search section or lesson...">
        </div>

        <div class="teleport-lang-switch-box">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:18px;">🌐</span>
                <div>
                    <div style="font-size:13px; font-weight:700; color:var(--text-primary);">Roman English Mode</div>
                    <div style="font-size:11px; color:var(--text-muted);" id="teleport-lang-status">Current: English</div>
                </div>
            </div>
            <button type="button" class="btn-toggle-roman" id="teleport-lang-btn">Switch to Roman</button>
        </div>

        <div class="teleport-items-grid" id="teleport-items-grid">
            <button type="button" class="teleport-item" data-jump="#setup-plugins">
                <span class="teleport-item-icon">📱</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 1: Setup & Mod APKs</span>
                    <span class="teleport-item-sub">TikTok Global v46.4.3 & Plugin</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#account-creation">
                <span class="teleport-item-icon">👤</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 2: Account Creation</span>
                    <span class="teleport-item-sub">UK & USA Account Setup</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#gip-explained">
                <span class="teleport-item-icon">🎮</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 3: Gaming Incentive Explained</span>
                    <span class="teleport-item-sub">Day 1–7 Account Warmup</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#cpa-campaigns">
                <span class="teleport-item-icon">🎯</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 4: CPA Campaigns & Minis</span>
                    <span class="teleport-item-sub">High-RPM Lead Monetization</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#followers-roadmap">
                <span class="teleport-item-icon">📈</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 5: 1k Followers Roadmap</span>
                    <span class="teleport-item-sub">Gaming Creators Method</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#views-tricks">
                <span class="teleport-item-icon">👁️</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 6: Views & Virality Tricks</span>
                    <span class="teleport-item-sub">Content Sourcing & Pacing</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#payouts-tax">
                <span class="teleport-item-icon">💳</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 7: Payouts & Tax Info</span>
                    <span class="teleport-item-sub">PayPal & W-8BEN Form</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#problems-solutions">
                <span class="teleport-item-icon">🛡️</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 8: Problems & Appeals</span>
                    <span class="teleport-item-sub">Overturn Disqualifications</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#multiple-accounts">
                <span class="teleport-item-icon">👥</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 9: Multiple Accounts</span>
                    <span class="teleport-item-sub">Scale 5+ Accounts Safely</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#ai-translated">
                <span class="teleport-item-icon">🌐</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 10: AI Translated Course</span>
                    <span class="teleport-item-sub">Multilingual Masterclass</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#contact">
                <span class="teleport-item-icon">📞</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">Step 11: Contact Hadi Awan</span>
                    <span class="teleport-item-sub">Telegram & WhatsApp</span>
                </div>
            </button>

            <button type="button" class="teleport-item" data-jump="#rpm-calculator">
                <span class="teleport-item-icon">💰</span>
                <div class="teleport-item-meta">
                    <span class="teleport-item-title">RPM & Payout Calculator</span>
                    <span class="teleport-item-sub">Live Earnings Estimator</span>
                </div>
            </button>
        </div>
    </div>

    <!-- Cinema / Theater Video Modal Player -->
    <div class="pro-modal-backdrop" id="video-modal">
        <div class="theater-modal-wrapper">
            <button class="modal-close-icon" id="modal-close-btn" title="Close Theater">&times;</button>
            <div class="theater-header-bar">
                <span class="theater-title" id="modal-video-title">Lecture Video</span>
                <span class="drive-badge">CINEMA THEATER MODE</span>
            </div>
            <div class="theater-iframe-container">
                <iframe id="modal-video-frame" src="" allowfullscreen></iframe>
            </div>
        </div>
    </div>

    <!-- Study Notes Drawer Modal -->
    <div class="pro-modal-backdrop" id="notes-modal">
        <div class="pro-modal-container" style="max-width:560px;">
            <button class="modal-close-icon" id="close-notes-modal-btn">&times;</button>
            <h3 style="margin:0 0 8px 0; font-size:18px; font-weight:800;">📝 My Study Notes</h3>
            <p style="font-size:13px; color:var(--text-muted); margin:0 0 16px 0;">Notes are auto-saved in your browser storage.</p>
            <textarea id="user-study-notes" rows="12" placeholder="Write your GIP strategies, account credentials, or video ideas here..." style="width:100%; padding:14px; border-radius:14px; border:1px solid #ded7c9; font-family:var(--font-body); font-size:14px; outline:none; resize:vertical; box-sizing:border-box;"></textarea>
        </div>
    </div>

    <!-- Pro Footer -->
    <footer class="pro-footer">
        <div style="max-width:1220px; margin:0 auto; padding:0 24px;">
            <div style="font-weight:700; color:var(--text-primary); margin-bottom:6px;">TikTok GIP Masterclass • Mentor: Hadi Awan</div>
            <div class="footer-subtext">
                <span class="footer-text-desktop">Complete 15-Video Educational Blueprint • All Rights Reserved.</span>
                <span class="footer-text-mobile">15 Lessons • All Rights Reserved</span>
            </div>
        </div>
    </footer>

    <!-- Interactive Script -->
    <script src="pro_app.js?v=10.0"></script>
</body>

</html>
"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print("Generated index.html with videos in respective sections and top hub removed successfully!")
