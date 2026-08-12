document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle & Backdrop Overlay
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('aside');
    const triggerBtns = document.querySelectorAll('.mobile-nav-toggle, .trigger-sidebar');
    
    if (sidebar && triggerBtns.length > 0) {
        triggerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isOpen = sidebar.classList.toggle('open');
                if (toggleBtn) {
                    toggleBtn.classList.toggle('open', isOpen);
                }
                
                let overlay = document.querySelector('.sidebar-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    document.body.appendChild(overlay);
                    overlay.addEventListener('click', () => {
                        sidebar.classList.remove('open');
                        if (toggleBtn) {
                            toggleBtn.classList.remove('open');
                        }
                        overlay.classList.remove('show');
                    });
                }
                
                if (isOpen) {
                    overlay.classList.add('show');
                } else {
                    overlay.classList.remove('show');
                }
            });
        });
    }

    // Close sidebar on link click (mobile)
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (toggleBtn) {
                    toggleBtn.classList.remove('open');
                }
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                }
            }
        });
    });

    // 2. Scroll Spy: Highlight navigation based on current view
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links li');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight a bit earlier for smoother transition
            if (pageYOffset >= (sectionTop - 180)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            const href = li.querySelector('a').getAttribute('href').substring(1);
            if (href === current) {
                li.classList.add('active');
            }
        });
    });

    // 3. Interactive Checklists using LocalStorage
    const checklistItems = document.querySelectorAll('.checklist-item');
    
    checklistItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const listId = checkbox.getAttribute('id');
        
        // Load initial state
        const isCompleted = localStorage.getItem(`gip_check_${listId}`) === 'true';
        if (isCompleted) {
            checkbox.checked = true;
            item.classList.add('completed');
        }
        
        // Toggle on item click
        item.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            
            // Save state
            const checked = checkbox.checked;
            localStorage.setItem(`gip_check_${listId}`, checked);
            
            if (checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    });

    // 4. Scroll Reveal Observer for Premium Entry Animations
    const revealElements = document.querySelectorAll('section, .card, .resource-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after showing so we don't repeat the animation
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        revealObserver.observe(el);
    });

    // 5. Liquid Scroll Progress Bar Tracker & Floating Menu Auto-Hide
    const progressBar = document.getElementById('scroll-progress');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    if (progressBar || mobileNavToggle) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
                    
                    // 1. Scroll Progress Bar
                    if (progressBar) {
                        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
                        progressBar.style.width = scrolled + '%';
                    }
                    
                    // 2. Auto-Hide Floating Menu on Scroll Down
                    if (mobileNavToggle && sidebar) {
                        if (!sidebar.classList.contains('open')) {
                            if (winScroll > lastScrollY && winScroll > 80) {
                                mobileNavToggle.classList.add('nav-hidden');
                            } else {
                                mobileNavToggle.classList.remove('nav-hidden');
                            }
                        }
                    }
                    
                    lastScrollY = winScroll <= 0 ? 0 : winScroll;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // -------------------------------------------------------------
    // 6. REAL-TIME TRANSLATION SYSTEM
    // -------------------------------------------------------------
    const langToggle = document.getElementById('lang-toggle');
    const langStatusText = document.getElementById('lang-status-text');

    const i18n = {
        en: {
            widgetTitle: "Language Mode",
            navSetup: "Setup & Plugins",
            navAccount: "Account Creation",
            navGip: "GIP Explained",
            navCpa: "CPA Campaigns",
            navFollowers: "1k Followers Roadmap",
            navViews: "Views & Tricks",
            navPayouts: "Payouts & Tax Info",
            navProblems: "Problems & Appeals",
            navMulti: "Multiple Accounts",
            navAi: "AI Translated Course",
            navContact: "Contact Me",
            
            heroBadge: "TIKTOK GIP MASTERCLASS 2026",
            heroTitle: "TikTok Gaming Incentive Program",
            heroSubtitle: "Complete Step-by-Step Blueprint & Verified Strategies by Hadi",
            btnModules: "Course Modules",
            mentorLabel: "Mentor: Hadi Awan",
            heroAlertTitle: "Important Course Instructions",
            heroAlertDesc: "Read all instructions carefully and watch each video in sequence without skipping to ensure correct execution!",
            
            titleSetup: "Setup & Plugins",
            setupCard1Title: "Step 1: Download Essential Mod Apps",
            setupCard1Desc: "First download two essential apps from the Resources link. You must uninstall the regular Google Play Store TikTok version before installing these, or they won't install. <strong>Login with your personal account.</strong>",
            setupCard1Alert: "Make sure you have at least <strong>6GB free storage space</strong> on your mobile phone if the installation fails.",
            resAllApkTitle: "All APK Resources",
            resAllApkSub: "MediaFire Folder",
            resTiktokGlobalTitle: "TikTok Global (v46.4.3)",
            resDownloadSub: "MediaFire Download",
            resTiktokPluginTitle: "TikTok Plugin (v2.45)",
            resTiktokAsiaTitle: "TikTok Asia (v41.9.3)",
            setupCard2Title: "Step 2: Install Browser & VPN Tool",
            setupCard2Desc1: "After installing TikTok Global and TikTok Plugin, install the following browser and VPN. These are used to create secure TikTok accounts in specific country regions (UK, USA, France, etc.).",
            setupCard2Desc2: "Note: If you already have a premium VPN installed on your phone, you can use that as well. However, you MUST use the Orion Browser.",
            resOrionBrowserTitle: "Orion's Browser",
            resPlayStoreSub: "Google Play Store",
            resVpnifyTitle: "Vpnify Premium (v2.5.0)",
            
            titleAccount: "Account Creation",
            accountCardTitle: "How to Create UK & USA TikTok Accounts",
            accountCardDesc: "Follow the step-by-step video instructions to create fully verified UK, USA, or France accounts. In the video, Abdul Hadi explains the precise workflow of creating regional accounts securely.",
            accountVideoTitle: "How to create TikTok UK/USA Account",
            accountVideoDesc: "Tutorial on creating geo-targeted accounts using Orion Browser and Vpnify Premium.",
            resAppLinkSub: "App Link",
            resModApkSub: "Mod APK Link",
            resDownloadVideoTitle: "Download Video",
            resDriveLinkSub: "Google Drive Link",
            
            titleGip: "Gaming Incentive Explained",
            gipCard1Title: "💡 Critical Account Setup & Warm Up (Day 1 - 7)",
            gipCard1Desc1: "Do not treat your accounts as upload machines immediately! We must warm them up to make the algorithm register that we are a real human user. Otherwise, you will run into the zero views issue.",
            gipCard1Desc2: "Create 3-4 accounts (e.g., 2 UK and 2 USA) and follow the 4-day checklist below before uploading any campaign videos.",
            chkDay1_2Title: "Day 1 - 2: Pure Interaction",
            chkDay1_2Desc: "Just browse TikTok in your gaming niche. Leave 5-10 likes, 2-3 detailed comments (no emojis or \"nice\"), and follow 2-3 creators in your niche. Do not upload!",
            chkDay3Title: "Day 3: Save & Share Activity",
            chkDay3Desc: "Repeat previous activities. Save 1 video, share 1 video (via copy link or WhatsApp). Do not upload!",
            chkDay4Title: "Day 4: First Short Upload",
            chkDay4Desc: "Upload your first simple short video (7-15s). After uploading, keep scrolling on TikTok; don't close the app immediately. Ensure it's English/global content to test reach.",
            chkDay5_7Title: "Day 5 - 7: Consistency Training",
            chkDay5_7Desc: "Upload exactly 1 video per day. Keep the niche, style, and upload timing identical. Avoid auto-tools, changing VPNs, or re-uploading duplicate videos.",
            gipMilestoneTitle: "Earning Verification Milestone",
            gipMilestoneDesc: "After Day 4, if your account gets 150+ views, it has good initial reach. Reach out to Abdul Hadi on WhatsApp with your account link once it is set up. <strong>He will provide you with the 1,000 followers needed to activate the GIP event!</strong>",
            gipCard2Title: "Course Lectures: What is GIP & Editing Guides",
            gipLec1Title: "Lecture 1: Introduction to TikTok GIP",
            gipLec1Desc: "Overview of the Gaming Incentive Program, benefits over CRP, and basic entry requirements.",
            gipLec2Title: "Lecture 2: How to Edit Videos for GIP",
            gipLec2Desc: "Step-by-step editing process to create highly engaging gaming content tailored for TikTok GIP.",
            gipLec3Title: "Lecture 3: How to Properly Upload GIP Videos",
            gipLec3Desc: "Guide on hashtags, descriptions, and regional settings during video upload to maximize monetization results.",
            
            titleCpa: "GIP CPA Campaign's & Full-Time Plan",
            cpaCard1Title: "CPA Campaigns & Minis Explained",
            cpaCard1Desc: "Learn how to work with GIP CPA campaigns (Cost Per Action) and maximize earnings. Abdul Hadi outlines the complete full-time plan comparing GIP minis with CRP.",
            cpaVideo1Title: "TikTok GIP CPA Campaigns",
            cpaVideo1Desc: "Deep-dive into CPA mechanics, high RPM strategies, and campaign selection.",
            cpaVideo2Title: "TikTok Minis & Full Time GIP Plan",
            cpaVideo2Desc: "Strategy for building a sustainable, long-term full-time GIP campaign stream.",
            cpaCard2Title: "📋 What You Will Learn",
            cpaLearnContent: "1. Introduction to TikTok Minis<br>2. Creator Reward Program (CRP) requirements vs GIP Minis<br>3. Hurdles faced in the TikTok Creator Reward Program<br>4. Requirements & benefits of GIP Minis over CRP<br>5. Why choose GIP over CRP for new zero-follower accounts<br>6. Step-by-step creation of GIP Minis optimized video templates",
            
            titleFollowers: "1k Followers Roadmap (Gaming Creators Method)",
            followersCardTitle: "🎯 The 1000 Followers Gaming Strategy",
            followersCardDesc: "Use this official safe follower strategy to build a real gaming audience and reach 1k followers organically within 1-2 weeks. Ensure you strictly follow the steps below to avoid spam flags.",
            fStep1Title: "Step 1: Gaming Profile Optimization",
            fStep1Desc: "Set a gaming username, upload a custom gaming logo/avatar, and set a clean bio (e.g., \"Gaming Content 🎮 | Daily Clips\"). Upload 3-5 short clips before starting so profile looks active.",
            fStep2Title: "Step 2: Target Right Gaming Creators",
            fStep2Desc: "Find niche creators having between 5k-50k followers. Focus on active accounts with alive comment sections. Target their followers and active commenters.",
            fStep3Title: "Step 3: Safe Follow Plan (Limit 80-90/day)",
            fStep3Desc: "Spread follows across three times: Morning (25-30), Afternoon (25-30), and Night (25-30). Do not follow all at once or use automation tools!",
            fStep4Title: "Step 4: The Double-Touch Interaction Trick",
            fStep4Desc: "For each follow: Like 1 of their videos, and leave a genuine comment (e.g., \"GG bro 👌\", \"Nice gameplay 🔥\", \"Clean gaming 🎮\"). This doubles follow-back rate!",
            fStep5Title: "Step 5: The 24-48 Hours Unfollow Rule",
            fStep5Desc: "Wait 1-2 days. Keep those who follow back. Slowly unfollow those who don't (limit unfollows to 20-30 max at a time).",
            fStep6Title: "Step 6: Expectation Check (10-14 days to 1k)",
            fStep6Desc: "With a 30-50% followback rate, 80 follows per day yields 25-40 followers. You will reach your target 1000 followers milestone safely in 10-14 days!",
            
            titleViews: "Views & Tricks",
            viewsCardTitle: "Views & Easy Content Strategy",
            viewsCardDesc: "Abdul Hadi shares unique editing and sourcing templates to boost views and revenue without spending massive time editing. Watch the detailed tricks below.",
            viewsVideo1Title: "Part 1: Easy Content & Views Trick",
            viewsVideo1Desc: "How to increase views and RPM by selecting specific gaming niches.",
            viewsVideo2Title: "Part 2: Exclusive Easy Content Sourcing",
            viewsVideo2Desc: "Learn how to source and package viral templates for GIP campaigns.",
            viewsAlertTitle: "Exclusive Side Content Layout",
            viewsAlertDesc: "This section includes an exclusive side content strategy to multiply views across multi-accounts.",
            
            titlePayouts: "Payouts & Tax Info",
            payoutsCard1Title: "Withdrawal Setup: PayPal Creation",
            payoutsCard1Desc: "Since GIP rewards are sent via PayPal, watch the guide to creating a fully working Canada PayPal account from Pakistan or any unsupported region, along with verification tricks.",
            payoutsVideo1Title: "How to Create PayPal (Canada)",
            payoutsVideo1Desc: "Setup process, linking bank, and verifying identity to avoid limitations.",
            payoutsCard2Title: "Tax Information Setup (USA & UK / France)",
            payoutsCard2Desc: "How to complete USA or UK tax questionnaires on TikTok to avoid payout holds or accounts being locked.",
            payoutsVideo2Title: "How to Fill USA Tax Information",
            payoutsVideo2Desc: "Complete step-by-step walkthrough of inputting tax profiles for USA regions.",
            payoutsVideo3Title: "How to Fill UK/France Tax Information",
            payoutsVideo3Desc: "Easy guide to submitting tax questionnaires for European accounts.",
            resTaxGuideTitle: "USA Tax Document Guide",
            resTaxDetailsTitle: "See More Tax Details",
            
            titleProblems: "Problems & Appeals",
            problemsCardTitle: "Disqualification Appeals & No Event Issues",
            problemsCardDesc: "If your videos get disqualified from a campaign or the GIP Event button disappears from your dashboard due to unusual activity, follow these appeal guidelines.",
            problemsVideo1Title: "How to Appeal Disqualified Videos",
            problemsVideo1Desc: "The correct wording and procedure to submit video appeals successfully.",
            problemsVideo2Title: "No Event Showing Resolution",
            problemsVideo2Desc: "What to do if GIP options are hidden due to system flags or device settings.",
            
            titleMulti: "Managing Multiple Accounts & Mod Updates",
            multiCardTitle: "How to Work on Multiple Accounts Safely",
            multiCardDesc: "Scale up your earnings by running multiple accounts simultaneously on the same device. Follow these safety configurations to prevent device/IP linkage bans.",
            multiVideo1Title: "Multi-Account Management Strategy",
            multiVideo1Desc: "How to run clones and coordinate uploads across different regional parameters.",
            multiVideo2Title: "How to Update Apps By Yourself",
            multiVideo2Desc: "Guide to manually updating and modding TikTok Global/Plugin when new versions release.",
            resAllResTitle: "All Resources Folder",
            resTiktokPluginUpdatedTitle: "TikTok Plugin Updated (v2.22)",
            resDualSpaceTitle: "Dual Space Premium (v5.0.3)",
            
            titleAi: "AI Translated TikTok GIP Course",
            aiCardTitle: "Official TikTok GIP Guidelines (Hindi/Urdu translation)",
            aiCardDesc: "These documents are translated from the official TikTok creator database. Use them to understand official rules, though check sections above for the optimized community tactics.",
            resAiIntroTitle: "1. Introduction",
            resAiStepsTitle: "2. Start Earning in 3 Steps",
            resAiMaxTitle: "3. Maximize Earnings",
            resAiWithdrawTitle: "4. How to Withdraw",
            
            titleContact: "Contact",
            contactCard1Title: "📫 Get In Touch",
            contactCard1Desc: "If you have any questions regarding the TikTok Gaming Incentive Program, need account validation, or require GIP followers setup, please send me an email.",
            contactResTitle: "Email Address",
            contactFoot: "Feel free to reach out for questions, account verifications, or GIP resources updates. I am always happy to help you scale your campaigns!",
            contactCard2Title: "💼 Premium Services & Softwares",
            contactCard2Desc: "We provide a comprehensive range of premium digital services and custom solutions to scale your workflows:",
            serviceSubTitle: "Website Subscriptions",
            serviceSubDesc: "Access keys and premium subscription accounts for various marketing, cloud, and analytical platforms.",
            serviceFollowTitle: "Followers & Social Growth",
            serviceFollowDesc: "Fast and secure follower boost services to easily fulfill the GIP application criteria.",
            serviceAutoTitle: "Custom Automation Softwares",
            serviceAutoDesc: "Automated helper tools, macros, and modded APKs designed to scale up GIP actions.",
            serviceAppTitle: "Premium Paid Applications",
            serviceAppDesc: "Licensed accounts for premium video editors, proxies, and VPN applications.",
            serviceFoot: "If you require any of these services or have a custom request, please send a message with your specifications to our email: Abdulhadipro47@gmail.com. We will get back to you with the custom setup details and pricing.",
            
            footerCopy: "© 2026 Abdul Hadi GIP Program. All rights reserved.",
            footerAuthor: "Website created by Hadi Awan"
        },
        roman: {
            widgetTitle: "Language Mode",
            navSetup: "Setup aur Plugins",
            navAccount: "Account Banana",
            navGip: "GIP ki Details",
            navCpa: "CPA Campaigns",
            navFollowers: "1k Followers Roadmap",
            navViews: "Views aur Tricks",
            navPayouts: "Payouts aur Tax Info",
            navProblems: "Masail aur Appeals",
            navMulti: "Multiple Accounts",
            navAi: "AI Translated Course",
            navContact: "Rabta Karein",
            
            heroBadge: "TIKTOK GIP MASTERCLASS 2026",
            heroTitle: "TikTok Gaming Incentive Program",
            heroSubtitle: "Hadi Awan ki GIP course ki complete step-by-step masterclass guide.",
            btnModules: "Course ke Modules",
            mentorLabel: "Mentor: Hadi Awan",
            heroAlertTitle: "Zaroori Course Instructions",
            heroAlertDesc: "Sari instructions ko dhyan se parhein aur har video ko bina skip kiye ek ke baad ek dekhein taake sahi se kaam ho sake!",
            
            titleSetup: "Setup aur Plugins",
            setupCard1Title: "Step 1: Zaroori Mod Apps Download Karein",
            setupCard1Desc: "Sabse pehle resources link se do zaroori apps download karein. Install karne se pehle regular Play Store wali TikTok ko uninstall karna lazmi hai, warna ye install nahi hogi. <strong>Apne personal account se login karein.</strong>",
            setupCard1Alert: "Agar install na ho to check karein ke mobile mein kam se kam <strong>6GB space free</strong> ho.",
            resAllApkTitle: "Sare APK Resources",
            resAllApkSub: "MediaFire Folder",
            resTiktokGlobalTitle: "TikTok Global (v46.4.3)",
            resDownloadSub: "MediaFire Download",
            resTiktokPluginTitle: "TikTok Plugin (v2.45)",
            resTiktokAsiaTitle: "TikTok Asia (v41.9.3)",
            setupCard2Title: "Step 2: Browser aur VPN Tool Install Karein",
            setupCard2Desc1: "TikTok Global aur TikTok Plugin install karne ke baad ye browser aur VPN install karein. Ye specific countries (UK, USA, France, etc.) ke secure accounts banane ke kaam aayenge.",
            setupCard2Desc2: "Note: Agar aapke paas koi aur premium VPN hai to aap wo bhi use kar sakte hain, par browser aapko Orion hi use karna hoga.",
            resOrionBrowserTitle: "Orion Browser",
            resPlayStoreSub: "Google Play Store",
            resVpnifyTitle: "Vpnify Premium (v2.5.0)",
            
            titleAccount: "Account Banana",
            accountCardTitle: "UK aur USA TikTok Accounts Kaise Banayein",
            accountCardDesc: "UK, USA, ya France ka fully verified account banane ke liye video instructions ko step-by-step follow karein. Video mein Abdul Hadi ne secure tareeqe se accounts banane ka workflow samjhaya hai.",
            accountVideoTitle: "TikTok UK/USA Account Kaise Banayein",
            accountVideoDesc: "Orion Browser aur Vpnify Premium se geo-targeted accounts banane ka tutorial.",
            resAppLinkSub: "App Link",
            resModApkSub: "Mod APK Link",
            resDownloadVideoTitle: "Download Video",
            resDriveLinkSub: "Google Drive Link",
            
            titleGip: "Gaming Incentive ki Detail",
            gipCard1Title: "💡 Account Setup aur Warm Up (Day 1 - 7)",
            gipCard1Desc1: "Apne accounts ko aate hi upload machine mat banayein! Hamein pehle accounts ko warm up karna hoga taake algorithm ko lage ke ye real human hai, warna zero views ka issue aayega.",
            gipCard1Desc2: "3-4 accounts banayein (jaise 2 UK aur 2 USA) aur videos upload karne se pehle nichey diye gaye warm-up steps ko follow karein.",
            chkDay1_2Title: "Day 1 - 2: Sirf Interaction",
            chkDay1_2Desc: "Bas apni niche ki videos dekho, 5-10 likes karo, 2-3 achhi comments karo (sirf emoji nahi), aur 2-3 accounts follow karo. Upload bilkul nahi karna!",
            chkDay3Title: "Day 3: Save aur Share",
            chkDay3Desc: "Wahi activity repeat karo. 1 video save karo aur 1 video share (WhatsApp ya copy link) karo. Upload nahi karna.",
            chkDay4Title: "Day 4: Pehli Video Upload",
            chkDay4Desc: "Pehli simple video upload karo (7-15 sec). Upload ke baad app band mat karo, thori der scroll karo. Reach check karne ke liye English content upload karein.",
            chkDay5_7Title: "Day 5 - 7: Consistency aur Rules",
            chkDay5_7Desc: "Roz sirf 1 video upload karein. Same niche, same style, aur same timing rakhni hai. Bots, bar-bar VPN change karna, aur duplicate upload se bachein.",
            gipMilestoneTitle: "Earning Verification Milestone",
            gipMilestoneDesc: "Day 4 ke baad agar aapke account par 150+ views aate hain to iska matlab reach achhi hai. Apne account ka link mujhe WhatsApp par send karein, main aapko GIP event ke liye 1,000 followers provide kar doon ga!",
            gipCard2Title: "Course Lectures: GIP aur Editing Guides",
            gipLec1Title: "Lecture 1: TikTok GIP ka Introduction",
            gipLec1Desc: "GIP program kya hai aur iski kiya requirements hain, iska poora overview.",
            gipLec2Title: "Lecture 2: GIP Videos Edit Kaise Karein",
            gipLec2Desc: "TikTok GIP ke liye gaming videos create aur edit karne ka step-by-step tarika.",
            gipLec3Title: "Lecture 3: GIP Videos Sahi se Upload Kaise Karein",
            gipLec3Desc: "Hashtags, descriptions, aur regional settings ke saath video upload karne ki sahi guide.",
            
            titleCpa: "GIP CPA Campaigns aur Full-Time Plan",
            cpaCard1Title: "CPA Campaigns aur Minis ki Detail",
            cpaCard1Desc: "CPA campaigns par kaam karna aur apni earnings barhany ka tarika. Abdul Hadi ne GIP Minis aur CRP ka full plan samjhaya hai.",
            cpaVideo1Title: "TikTok GIP CPA Campaigns",
            cpaVideo1Desc: "CPA mechanics aur zyada RPM hasil karne ke liye campaigns select karne ki details.",
            cpaVideo2Title: "TikTok Minis aur Full-Time Plan",
            cpaVideo2Desc: "GIP campaign se long-term earn karne ke liye full-time business strategy.",
            cpaCard2Title: "📋 Aap Kya Seekhenge",
            cpaLearnContent: "1. TikTok Minis kya hain<br>2. CRP requirements vs GIP Minis<br>3. CRP ke masail aur unka hal<br>4. GIP Minis ke requirements aur faide<br>5. Zero-follower accounts par GIP kyun behtar hai<br>6. GIP Minis ke liye optimized video templates banana",
            
            titleFollowers: "1k Followers Roadmap (Gamers Method)",
            followersCardTitle: "🎯 1000 Followers ki Gaming Strategy",
            followersCardDesc: "1-2 weeks ke andar organically 1k followers complete karne ka safe gamers method. Spam se bachne ke liye steps ko strictly follow karein.",
            fStep1Title: "Step 1: Gaming Profile Sahi Karen",
            fStep1Desc: "Gaming username aur logo lagayein, aur bio mein \"Gaming Content 🎮\" likhein. Follower method se pehle 3-5 videos upload hona zaroori hain.",
            fStep2Title: "Step 2: Sahi Gamers ko Target Karen",
            fStep2Desc: "5k se 50k followers wale active gaming creators dhoondo. Unke active followers aur comment karne walon ko target karo.",
            fStep3Title: "Step 3: Safe Follow Limit (80-90/Day)",
            fStep3Desc: "Follows ko din mein 3 dafa divide karein: Subah (25-30), Dopahar (25-30), aur Raat (25-30). Ek sath follow mat karein aur na hi bots use karein.",
            fStep4Title: "Step 4: Interaction Trick (Follow + Like + Comment)",
            fStep4Desc: "Har follow ke saath unki 1 video like karein aur real comment karein (GG bro, nice gameplay, etc.). Is se follow-back milne ke chances double ho jate hain.",
            fStep5Title: "Step 5: Unfollow Rules",
            fStep5Desc: "1-2 din wait karein. Jo follow back karein unhein rehne dein, baqiyon ko aahista unfollow karein (ek waqt mein max 20-30).",
            fStep6Title: "Step 6: 10-14 Din mein Target",
            fStep6Desc: "30-50% followback ke hisab se daily 80 follows par 25-40 followers milenge. Aap 10-14 din mein 1000 followers complete kar lenge.",
            
            titleViews: "Views aur Aasan Content Tricks",
            viewsCardTitle: "Views aur Aasan Content ki Strategy",
            viewsCardDesc: "Bina zyada mehnat ke views aur revenue barhany ke liye templates aur editing techniques. Nichey di gayi tricks ko dekhein.",
            viewsVideo1Title: "Part 1: Aasan Content aur Views Trick",
            viewsVideo1Desc: "Specific gaming niches select kar ke views aur RPM barhany ka tarika.",
            viewsVideo2Title: "Part 2: Viral Content Sourcing",
            viewsVideo2Desc: "GIP campaigns ke liye viral templates dhoondne aur unhein set karne ka tarika.",
            viewsAlertTitle: "Exclusive Side Content Layout",
            viewsAlertDesc: "Is section mein multiple accounts par views barhany ki exclusive strategy shamil hai.",
            
            titlePayouts: "Payouts aur Tax Verification",
            payoutsCard1Title: "Withdrawal Setup: PayPal Kaise Banayein",
            payoutsCard1Desc: "GIP rewards PayPal ke zariye milti hain, is liye Pakistan ya kisi bhi unsupported region se Canada ka working PayPal banane aur verify karne ka tarika dekhein.",
            payoutsVideo1Title: "Canada ka PayPal Kaise Banayein",
            payoutsVideo1Desc: "PayPal setup, bank link karne, aur identity verify karne ka poora process.",
            payoutsCard2Title: "Tax Information Setup (USA aur UK / France)",
            payoutsCard2Desc: "Payout holds ya account block hone se bachne ke liye TikTok par USA/UK ke tax documents fill karne ka tarika.",
            payoutsVideo2Title: "USA Tax Information Kaise Fill Karen",
            payoutsVideo2Desc: "USA accounts ke liye tax profiles fill karne ka complete process.",
            payoutsVideo3Title: "UK/France Tax Information Kaise Fill Karen",
            payoutsVideo3Desc: "European accounts ke liye tax document submit karne ki aasan guide.",
            resTaxGuideTitle: "USA Tax Document Guide",
            resTaxDetailsTitle: "Mazeed Tax Details",
            
            titleProblems: "Masail aur Appeals",
            problemsCardTitle: "Video Disqualification aur No Event Solution",
            problemsCardDesc: "Agar videos disqualify ho jayein ya dashboard se GIP Event button gayab ho jaye, to in guidelines ko follow kar ke appeal karein.",
            problemsVideo1Title: "Disqualified Videos par Appeal Kaise Karen",
            problemsVideo1Desc: "Appeals submit karne ka sahi procedure aur words taake video wapas monetize ho.",
            problemsVideo2Title: "No Event Showing ka Solution",
            problemsVideo2Desc: "Agar system flags ya device settings ki wajah se GIP event show na ho to kya karein.",
            
            titleMulti: "Multiple Accounts aur Mod Updates",
            multiCardTitle: "Multiple Accounts par Safely Kaise Kaam Karen",
            multiCardDesc: "Ek hi device par ek se zyada accounts chala kar earning barhayein. IP link hone aur ban se bachne ke liye ye safety settings follow karein.",
            multiVideo1Title: "Multiple Accounts Management Strategy",
            multiVideo1Desc: "Clones banane aur different regions ke accounts manage karne ka tarika.",
            multiVideo2Title: "Apps ki Updates Kaise Karen",
            multiVideo2Desc: "TikTok Global aur Plugin ko khud se update aur mod karne ki guide.",
            resAllResTitle: "All Resources Folder",
            resTiktokPluginUpdatedTitle: "TikTok Plugin Updated (v2.22)",
            resDualSpaceTitle: "Dual Space Premium (v5.0.3)",
            
            titleAi: "AI Translated TikTok GIP Course",
            aiCardTitle: "Official TikTok GIP Guidelines (Hindi/Urdu translation)",
            aiCardDesc: "Ye official TikTok database se translated documents hain. Official rules ko samajhne ke liye inhein parhein.",
            resAiIntroTitle: "1. Introduction",
            resAiStepsTitle: "2. Teen Steps mein Earning",
            resAiMaxTitle: "3. Earnings Zyada Karen",
            resAiWithdrawTitle: "4. Withdraw Kaise Karen",
            
            titleContact: "Rabta",
            contactCard1Title: "📫 Get In Touch",
            contactCard1Desc: "Agar GIP program ke baare mein koi sawal ho, account verify karwana ho, ya followers chahiye hon, to mujhe email karein.",
            contactResTitle: "Email Address",
            contactFoot: "Sawal, account verification, ya resources updates ke liye kisi bhi waqt rabta kar sakte hain. Main hamesha help ke liye tayar hoon!",
            contactCard2Title: "💼 Premium Services aur Softwares",
            contactCard2Desc: "Hum aapki workflow ko behtar banane ke liye premium digital services aur software provide karte hain:",
            serviceSubTitle: "Website Subscriptions",
            serviceSubDesc: "Different marketing tools, cloud accounts, aur premium keys.",
            serviceFollowTitle: "Followers aur Social Growth",
            serviceFollowDesc: "TikTok par GIP event active karne ke liye fast aur secure follower boost.",
            serviceAutoTitle: "Custom Automation Softwares",
            serviceAutoDesc: "GIP workflow ko aasan aur scale karne ke liye helper tools, macros aur modded APKs.",
            serviceAppTitle: "Premium Paid Applications",
            serviceAppDesc: "Premium video editors, secure proxies, aur premium VPN keys.",
            serviceFoot: "Agar aapko in mein se koi service chahiye, to apni details is email par send karein: Abdulhadipro47@gmail.com. Hum jald hi aapse details aur pricing share karenge.",
            
            footerCopy: "© 2026 Abdul Hadi GIP Program. All rights reserved.",
            footerAuthor: "Website created by Hadi Awan"
        }
    };

    function applyTranslation(lang) {
        const isEnglish = (lang === 'en');
        const dict = i18n[isEnglish ? 'en' : 'roman'];
        
        // Update checkbox switch state
        if (langToggle) {
            langToggle.checked = isEnglish;
        }

        // Update status text next to the switch
        if (langStatusText) {
            langStatusText.textContent = isEnglish ? 'English' : 'Roman';
        }

        // Apply translations to all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });
    }

    // Load initial preference
    const savedLang = localStorage.getItem('gip_lang') || 'en';
    applyTranslation(savedLang);

    // Event listener for the language toggle switch
    if (langToggle) {
        langToggle.addEventListener('change', () => {
            const selectedLang = langToggle.checked ? 'en' : 'roman';
            localStorage.setItem('gip_lang', selectedLang);
            applyTranslation(selectedLang);
        });
    }
});
