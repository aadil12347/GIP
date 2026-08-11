document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle & Backdrop Overlay
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('aside');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('open');
            toggleBtn.classList.toggle('open');
            
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                    toggleBtn.classList.remove('open');
                    overlay.classList.remove('show');
                });
            }
            
            if (isOpen) {
                overlay.classList.add('show');
            } else {
                overlay.classList.remove('show');
            }
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

    // 5. Liquid Scroll Progress Bar Tracker
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressBar.style.width = scrolled + '%';
        });
    }
});
