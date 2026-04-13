// Placeholder frame generator (replace with real frames later)
function generatePlaceholderFrames(count) {
  const frames = [];
  
  for (let i = 0; i < count; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    // Gradient from dark navy → warm orange → bright sky
    // Simulates: dark room → sunrise → mountain reveal
    const progress = i / (count - 1);
    
    let color1, color2;
    
    if (progress < 0.3) {
      // Dark room phase
      const t = progress / 0.3;
      color1 = interpolateColor('#1a1a2e', '#2d1b3d', t);
      color2 = interpolateColor('#0a0a14', '#1a1a2e', t);
    } else if (progress < 0.7) {
      // Sunrise phase
      const t = (progress - 0.3) / 0.4;
      color1 = interpolateColor('#2d1b3d', '#c9723e', t);
      color2 = interpolateColor('#1a1a2e', '#8B6F47', t);
    } else {
      // Mountain reveal phase
      const t = (progress - 0.7) / 0.3;
      color1 = interpolateColor('#c9723e', '#87CEEB', t);
      color2 = interpolateColor('#8B6F47', '#FAF9F6', t);
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1920, 1080);
    
    // Add subtle noise texture for realism
    ctx.fillStyle = `rgba(255,255,255,${0.02 * progress})`;
    for (let j = 0; j < 1000; j++) {
      const x = Math.random() * 1920;
      const y = Math.random() * 1080;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Convert to Image
    const img = new Image();
    img.src = canvas.toDataURL();
    frames.push(img);
  }
  
  return frames;
}

function interpolateColor(color1, color2, t) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;
  
  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('The Satluj main.js initialized');
    // ----------------------------------------------------------------------
    // NAVIGATION SCROLL STATE (GSAP ScrollTrigger)
    // ----------------------------------------------------------------------
    const navWrap = document.getElementById('nav-wrap');
    const heroSection = document.getElementById('hero');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && navWrap && heroSection) {
        gsap.registerPlugin(ScrollTrigger);
        
        ScrollTrigger.create({
            trigger: heroSection,
            start: "bottom top", 
            onEnter: () => navWrap.classList.add('nav-scrolled'),
            onLeaveBack: () => navWrap.classList.remove('nav-scrolled')
        });
    } else if (navWrap) {
        // Fallback for native scroll event if GSAP fails to load
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight - 50) {
                navWrap.classList.add('nav-scrolled');
            } else {
                navWrap.classList.remove('nav-scrolled');
            }
        }, { passive: true });
    }

    // ----------------------------------------------------------------------
    // MOBILE MENU OVERLAY AND ANIMATIONS
    // ----------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburgerBtn && closeMenuBtn && menuOverlay) {
        function openMenu() {
            menuOverlay.classList.remove('translate-x-full');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            
            // Stagger animation for links
            mobileLinks.forEach((link, index) => {
                // Add base transition properties specifically when opening
                link.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    link.classList.remove('opacity-0', 'translate-y-4');
                    link.classList.add('opacity-100', 'translate-y-0');
                }, 300 + (index * 100)); // 300ms delay to let the menu slide in first
            });
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuOverlay.classList.add('translate-x-full');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            
            // Reset link states immediately without stagger so they are ready for next open
            mobileLinks.forEach(link => {
                link.style.transition = 'none';
                link.classList.remove('opacity-100', 'translate-y-0');
                link.classList.add('opacity-0', 'translate-y-4');
            });
            
            // Restore body scroll
            document.body.style.overflow = '';
        }

        hamburgerBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menuOverlay.classList.contains('translate-x-full')) {
                closeMenu();
                // Return focus to hamburger button for accessibility
                hamburgerBtn.focus();
            }
        });
    }

    // ----------------------------------------------------------------------
    // GLOBAL ANIMATION SWEEP
    // ----------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const fadeSettings = { y: 40, opacity: 0 };
        const fadeToSettings = { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" };

        const bindFadeUp = (element) => {
            gsap.fromTo(element, fadeSettings, {
                ...fadeToSettings,
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", // Trigger at 85% of viewport
                    toggleActions: "play none none none"
                }
            });
        };

        const bindStaggerFadeUp = (elements, triggerElement) => {
            gsap.fromTo(elements, fadeSettings, {
                ...fadeToSettings,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: triggerElement,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        };

        // 1. About section: fade up
        const aboutInner = document.querySelector('.about-inner');
        if (aboutInner) bindFadeUp(aboutInner);

        // 2. About stats: stagger fade up
        const statItems = document.querySelectorAll('.stat-item');
        if (statItems.length > 0) bindStaggerFadeUp(statItems, '.about-stats');

        // 3. Room card: fade up
        const roomCard = document.querySelector('.room-card');
        if (roomCard) bindFadeUp(roomCard);

        // 4. Experience cards: stagger (0.15s delay)
        const expCards = document.querySelectorAll('.exp-card');
        if (expCards.length > 0) bindStaggerFadeUp(expCards, '.exp-grid');

        // 5. Cafe content: fade up
        const cafeContent = document.querySelector('.cafe-content');
        if (cafeContent) bindFadeUp(cafeContent);

        // Cafe Parallax (Special) - Background translation
        const cafeBg = document.getElementById('cafe-bg');
        if (cafeBg) {
            gsap.fromTo(cafeBg, { y: -40 }, {
                y: 40, ease: "none",
                scrollTrigger: {
                    trigger: "#cafe",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // 6. Gallery images: stagger fade in
        const galleryImgs = document.querySelectorAll('.gallery-img');
        if (galleryImgs.length > 0) bindStaggerFadeUp(galleryImgs, '.columns-2');

        // 7. Testimonial section: fade up
        const testimonialSection = document.querySelector('#testimonials');
        if (testimonialSection) bindFadeUp(testimonialSection);

        // 8. Location section: fade up
        const locWrap = document.querySelector('#location');
        if (locWrap) bindFadeUp(locWrap);

        // 9. Attractions section: fade up
        const attractionsSection = document.querySelector('#attractions');
        if (attractionsSection) bindFadeUp(attractionsSection);
    }

    // ----------------------------------------------------------------------
    // WHATSAPP BOOKING FORM LOGIC
    // ----------------------------------------------------------------------
    const formCtaBtn = document.getElementById('form-cta-btn');
    if (formCtaBtn) {
        formCtaBtn.addEventListener('click', () => {
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const guests = document.getElementById('guests').value;
            
            let message = "Hi! I'd like to book a room at The Satluj, Kalpa.";
            if (checkin && checkout && guests) {
                message = `Hi! I'd like to book at The Satluj, Kalpa.\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}`;
            }
            
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/919874068999?text=${encodedMessage}`, '_blank');
        });
    }

    // ----------------------------------------------------------------------
    // GUEST DROPDOWN COLOR TOGGLE
    // ----------------------------------------------------------------------
    const guestSelect = document.getElementById('guests');
    if (guestSelect) {
        guestSelect.addEventListener('change', () => {
            if (guestSelect.value) {
                guestSelect.classList.remove('guest-placeholder');
                guestSelect.classList.add('guest-selected');
            } else {
                guestSelect.classList.add('guest-placeholder');
                guestSelect.classList.remove('guest-selected');
            }
        });
    }

    // ----------------------------------------------------------------------
    // ABOUT MODAL LOGIC
    // ----------------------------------------------------------------------
    const aboutStoryBtn = document.getElementById('about-story-btn');
    const aboutModal = document.getElementById('about-modal');
    const aboutCloseBtn = document.getElementById('about-close-btn');
    const aboutModalBox = document.getElementById('about-modal-box');

    if (aboutStoryBtn && aboutModal && aboutCloseBtn) {
        const openAboutModal = () => {
            aboutModal.classList.remove('hidden');
            aboutModal.classList.add('pointer-events-auto');
            aboutModal.classList.remove('pointer-events-none');
            // Slight delay to allow display flex to apply before opacity transition
            setTimeout(() => {
                aboutModal.classList.remove('opacity-0');
                if(aboutModalBox) {
                    aboutModalBox.classList.remove('hidden');
                    aboutModalBox.classList.remove('scale-95');
                    aboutModalBox.classList.add('scale-100');
                }
            }, 10);
            document.body.style.overflow = 'hidden';
            aboutCloseBtn.focus();

            // ✨ NEW: Auto-dismiss on scroll (Fix #2)
            let lastScrollY = window.scrollY;
            const handleScroll = () => {
                const currentScrollY = window.scrollY;
                const scrollDelta = Math.abs(currentScrollY - lastScrollY);
                if (scrollDelta > 50) {
                    closeAboutModal();
                    window.removeEventListener('scroll', handleScroll);
                }
            };
            setTimeout(() => {
                window.addEventListener('scroll', handleScroll);
            }, 100);
        };

        const closeAboutModal = () => {
            aboutModal.classList.add('opacity-0');
            aboutModal.classList.add('pointer-events-none');
            aboutModal.classList.remove('pointer-events-auto');
            if(aboutModalBox) {
                aboutModalBox.classList.remove('scale-100');
                aboutModalBox.classList.add('scale-95');
            }
            setTimeout(() => {
                aboutModal.classList.add('hidden');
                if(aboutModalBox) aboutModalBox.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300); // Matches transition duration
        };

        aboutStoryBtn.addEventListener('click', openAboutModal);
        aboutCloseBtn.addEventListener('click', closeAboutModal);
        
        // Click outside
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) closeAboutModal();
        });

        // Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
                closeAboutModal();
                aboutStoryBtn.focus();
            }
        });
    }

    // ----------------------------------------------------------------------
    // ROOM CAROUSEL LOGIC
    // ----------------------------------------------------------------------
    const carouselImgs = document.querySelectorAll('.carousel-img');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const carouselContainer = document.getElementById('room-carousel');
    
    if (carouselImgs.length > 0 && carouselDots.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        
        const goToSlide = (index) => {
            carouselImgs[currentSlide].classList.remove('opacity-100', 'z-10');
            carouselImgs[currentSlide].classList.add('opacity-0', 'z-0');
            carouselDots[currentSlide].classList.remove('bg-[#C9A96E]', 'scale-110', 'active');
            carouselDots[currentSlide].classList.add('bg-white/50');
            
            currentSlide = index;
            
            carouselImgs[currentSlide].classList.remove('opacity-0', 'z-0');
            carouselImgs[currentSlide].classList.add('opacity-100', 'z-10');
            carouselDots[currentSlide].classList.remove('bg-white/50');
            carouselDots[currentSlide].classList.add('bg-[#C9A96E]', 'scale-110', 'active');
        };

        const nextSlide = () => {
            let nextIndex = (currentSlide + 1) % carouselImgs.length;
            goToSlide(nextIndex);
        };
        
        const prevSlide = () => {
            let prevIndex = (currentSlide - 1 + carouselImgs.length) % carouselImgs.length;
            goToSlide(prevIndex);
        };

        const startSlider = () => {
            slideInterval = setInterval(nextSlide, 4000);
        };

        const resetSlider = () => {
            clearInterval(slideInterval);
            startSlider();
        };

        // Initialize dots
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetSlider();
            });
        });

        // Swipe support variables
        let startX = 0;
        let endX = 0;

        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].screenX;
                clearInterval(slideInterval); // Pause on touch
            }, { passive: true });
            
            carouselContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].screenX;
                handleSwipe();
                startSlider(); // Resume after touch
            }, { passive: true });
        }

        const handleSwipe = () => {
            const threshold = 50;
            if (endX < startX - threshold) {
                // Swiped left
                nextSlide();
            } else if (endX > startX + threshold) {
                // Swiped right
                prevSlide();
            }
        };

        startSlider();
    }



    // ----------------------------------------------------------------------
    // GALLERY LIGHTBOX LOGIC
    // ----------------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCloseBtn = document.getElementById('lightbox-close');
    const lightboxPrevBtn = document.getElementById('lightbox-prev');
    const lightboxNextBtn = document.getElementById('lightbox-next');
    
    if (galleryItems.length > 0 && lightbox && lightboxImg) {
        let currentImageIndex = 0;
        let lbStartX = 0;
        let lbEndX = 0;

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = galleryItems[currentImageIndex].src;
            
            lightbox.classList.remove('hidden');
            lightbox.style.display = 'flex'; // ✨ NEW: Use flex for centering (Fix #7)
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
                lightboxImg.classList.remove('scale-95');
                lightboxImg.classList.add('scale-100');
            }, 10);
            
            document.body.style.overflow = 'hidden';
            if(lightboxCloseBtn) lightboxCloseBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.add('opacity-0');
            lightboxImg.classList.remove('scale-100');
            lightboxImg.classList.add('scale-95');
            
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        const nextLightboxImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            lightboxImg.src = galleryItems[currentImageIndex].src;
        };

        const prevLightboxImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            lightboxImg.src = galleryItems[currentImageIndex].src;
        };

        // Attach click to images
        galleryItems.forEach((img, index) => {
            img.addEventListener('click', () => {
                openLightbox(index);
            });
        });

        // UI Buttons
        if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
        if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxImage);
        if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxImage);

        // Click outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('hidden')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextLightboxImage();
                if (e.key === 'ArrowLeft') prevLightboxImage();
            }
        });

        // Swipe Navigation for Lightbox
        lightbox.addEventListener('touchstart', (e) => {
            lbStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            lbEndX = e.changedTouches[0].screenX;
            handleLightboxSwipe();
        }, { passive: true });

        const handleLightboxSwipe = () => {
            const threshold = 50;
            if (lbEndX < lbStartX - threshold) {
                nextLightboxImage(); // swiped left
            } else if (lbEndX > lbStartX + threshold) {
                prevLightboxImage(); // swiped right
            }
        };
    }

    // ----------------------------------------------------------------------
    // STICKY BOOKING BAR & FLOATING WHATSAPP
    // ----------------------------------------------------------------------
    const heroSectionEl = document.getElementById('hero');
    const stickyBookingBar = document.getElementById('booking-bar');
    const waFloatingBtn = document.getElementById('wa-btn');

    if (heroSectionEl && stickyBookingBar && waFloatingBtn) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Hero has scrolled out of view - show bar, bump whatsapp
                    stickyBookingBar.classList.add('visible');
                    stickyBookingBar.classList.remove('translate-y-full');
                    waFloatingBtn.classList.add('wa-bump');
                } else {
                    // Hero is in view - hide bar, reset whatsapp
                    stickyBookingBar.classList.remove('visible');
                    stickyBookingBar.classList.add('translate-y-full');
                    waFloatingBtn.classList.remove('wa-bump');
                }
            });
        }, {
            threshold: 0,
            rootMargin: "0px"
        });

        heroObserver.observe(heroSectionEl);
    }

    // ----------------------------------------------------------------------
    // FOOTER ACCORDION (Mobile)
    // ----------------------------------------------------------------------
    const footerToggles = document.querySelectorAll('.footer-toggle');
    
    footerToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            if (window.innerWidth >= 768) return; // Only for mobile
            
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            
            const content = toggle.nextElementSibling;
            const chevron = toggle.querySelector('span');
            
            if (!expanded) {
                content.style.maxHeight = content.scrollHeight + "px";
                if (chevron) chevron.classList.add('rotate-180');
            } else {
                content.style.maxHeight = "0px";
                if (chevron) chevron.classList.remove('rotate-180');
            }
        });
    });

    // ----------------------------------------------------------------------
    // HERO CANVAS INITIALIZATION (TASK 6A)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const totalFrames = 90;
        let frames = [];
        let activeFrameIndex = 0; // TASK 6B: Track current frame for scroll/resize sync

        // Set canvas resolution with DPR support
        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
            
            // Redraw current frame
            if (activeFrameIndex >= 0 && frames[activeFrameIndex]) {
                requestAnimationFrame(() => {
                    drawFrame(activeFrameIndex);
                });
            }
        }

        // Draw frame with "contain" fit
        function drawFrame(index) {
            const img = frames[index];
            if (!img || !img.complete) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Fill background
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Contain fit (show full image, centered)
            const canvasW = window.innerWidth;
            const canvasH = window.innerHeight;
            const scale = Math.min(canvasW / img.width, canvasH / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = (canvasW - w) / 2;
            const y = (canvasH - h) / 2;
            
            ctx.drawImage(img, x, y, w, h);
        }

        // Load frames with progress
        function loadFrames() {
            // ✨ TASK 6C: Low-memory device fallback (<4GB RAM)
            if (navigator.deviceMemory && navigator.deviceMemory < 4) {
                console.warn('Low memory device detected. Using static hero fallback.');
                
                // Show static background instead
                const heroBg = document.querySelector('.hero-bg');
                if (heroBg) {
                    heroBg.style.display = 'block';
                }
                
                // Hide canvas
                if (canvas) canvas.style.display = 'none';
                
                // Show booking form immediately
                const bookingForm = document.getElementById('booking-form');
                if (bookingForm) bookingForm.style.opacity = '1';
                
                // Dismiss loader
                const loader = document.getElementById('loader-screen');
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }
                return; // Exit early
            }

            const loader = document.getElementById('loader-screen');
            if (!loader) return;
            
            const loaderText = loader.querySelector('.loader-text');
            const loaderBar = loader.querySelector('.loader-bar-fill');
            
            if (loaderText) loaderText.textContent = 'Loading your Himalayan experience...';
            
            // Generate frames
            frames = generatePlaceholderFrames(totalFrames);
            let loaded = 0;
            
            frames.forEach((img, i) => {
                img.onload = () => {
                    loaded++;
                    const progress = (loaded / totalFrames) * 100;
                    if (loaderBar) {
                        loaderBar.style.transform = 'translateX(0)'; // Ensure alignment
                        loaderBar.style.width = `${progress}%`;
                    }
                    if (loaderText) loaderText.textContent = `Loading frames... ${loaded}/${totalFrames}`;
                    
                    if (loaded === totalFrames) {
                        console.log('90 frames loaded successfully.');
                        setTimeout(() => {
                            // Dismiss loader
                            if (window.siteLoader && typeof window.siteLoader.dismiss === 'function') {
                                window.siteLoader.dismiss();
                            }
                            
                            // Draw first frame
                            resizeCanvas();
                            drawFrame(0);
                            activeFrameIndex = 0;
                            
                            // ✨ TASK 6B: Initialize scroll sequence
                            initHeroScrollSequence();
                            
                            console.log('Canvas initialized and first frame rendered.');
                        }, 500);
                    }
                };
                
                // Fallback for cached images or immediate availability
                if (img.complete) {
                    img.onload();
                }
            });
        }

        // ════════════════════════════════════════
        // TASK 6B: GSAP SCROLL → FRAME SCRUBBING
        // ════════════════════════════════════════
        function initHeroScrollSequence() {
            const heroSection = document.getElementById('hero');
            const overlay = document.querySelector('.hero-overlay');
            
            if (!heroSection || !canvas || frames.length === 0) {
                console.error('Hero scroll sequence: Missing elements or frames');
                return;
            }

            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.error('Hero scroll sequence: GSAP/ScrollTrigger not loaded');
                return;
            }

            // Map scroll progress (0-1) to frame index (0-89)
            ScrollTrigger.create({
                trigger: heroSection,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5, // Buttery smooth 0.5s lag
                onUpdate: (self) => {
                    const rawIndex = self.progress * (totalFrames - 1);
                    const newIndex = Math.round(rawIndex);
                    const clampedIndex = Math.max(0, Math.min(newIndex, totalFrames - 1));

                    // Only redraw if frame actually changed (Performance Optimization)
                    if (clampedIndex !== activeFrameIndex) {
                        activeFrameIndex = clampedIndex;
                        requestAnimationFrame(() => {
                            drawFrame(activeFrameIndex);
                        });
                    }
                },
                // CANVAS PIN/UNPIN LOGIC
                onLeave: () => {
                    // Passed hero bottom -> Unpin
                    canvas.style.position = 'absolute';
                    canvas.style.top = 'auto';
                    canvas.style.bottom = '0';

                    if (overlay) {
                        overlay.style.position = 'absolute';
                        overlay.style.top = 'auto';
                        overlay.style.bottom = '0';
                    }

                    // ✨ NEW: Unpin booking form
                    const bookingForm = document.getElementById('booking-form');
                    if (bookingForm) {
                        bookingForm.style.position = 'absolute';
                        bookingForm.style.top = 'auto';
                        bookingForm.style.bottom = '10vh'; // Stay at bottom of hero
                        bookingForm.style.left = '50%';
                        bookingForm.style.transform = 'translateX(-50%)';
                    }

                    // ✨ NEW: Unpin overlay-4 (final CTA text)
                    const overlay4 = document.getElementById('overlay-4');
                    if (overlay4) {
                        overlay4.style.position = 'absolute';
                        overlay4.style.top = '25vh'; // Upper portion of final hero view
                        overlay4.style.left = '50%';
                        overlay4.style.transform = 'translateX(-50%)';
                    }

                    // Force final frame reveal
                    requestAnimationFrame(() => drawFrame(totalFrames - 1));
                },
                onEnterBack: () => {
                    // Back up into hero -> Re-pin
                    canvas.style.position = 'fixed';
                    canvas.style.top = '0';
                    canvas.style.bottom = 'auto';

                    if (overlay) {
                        overlay.style.position = 'fixed';
                        overlay.style.top = '0';
                        overlay.style.bottom = 'auto';
                    }

                    // ✨ NEW: Re-pin booking form
                    const bookingForm = document.getElementById('booking-form');
                    if (bookingForm) {
                        bookingForm.style.position = 'fixed';
                        bookingForm.style.top = 'auto';
                        bookingForm.style.bottom = '10vh';
                        bookingForm.style.left = '50%';
                        bookingForm.style.transform = 'translateX(-50%)';
                    }

                    // ✨ NEW: Re-pin overlay-4
                    const overlay4 = document.getElementById('overlay-4');
                    if (overlay4) {
                        overlay4.style.position = 'fixed';
                        overlay4.style.top = '35%';
                        overlay4.style.left = '50%';
                        overlay4.style.transform = 'translate(-50%, 0)';
                    }
                }
            });

            console.log('✓ Hero scroll sequence initialized (90 frames)');

            // ✨ TASK 6C: Initialize narrative animations
            initHeroTextOverlays();
            adjustOverlaysForMobile();
        }

        // ════════════════════════════════════════
        // TASK 6C: TEXT OVERLAYS & BOOKING REVEAL
        // ════════════════════════════════════════
        function initHeroTextOverlays() {
            const heroSection = document.getElementById('hero');
            if (!heroSection) return;
            
            const isMobile = window.innerWidth < 768;

            // 1. OVERLAY 1: Location Label (0-12%)
            gsap.to('#overlay-1', {
                opacity: 1,
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: '3% top',
                    scrub: 0.5,
                }
            });
            gsap.to('#overlay-1', {
                opacity: 0,
                scrollTrigger: {
                    trigger: heroSection,
                    start: '10% top',
                    end: '12% top',
                    scrub: 0.5,
                }
            });

            // 2. OVERLAY 2: Main Title (15-40%)
            gsap.to('#overlay-2', {
                opacity: 1,
                scrollTrigger: {
                    trigger: heroSection,
                    start: '15% top',
                    end: '18% top',
                    scrub: 0.5,
                }
            });
            gsap.to('#overlay-2', {
                opacity: 0,
                scrollTrigger: {
                    trigger: heroSection,
                    start: '37% top',
                    end: '40% top',
                    scrub: 0.5,
                }
            });

            // 3. OVERLAY 3: Tagline (45-70%) - DESKTOP ONLY
            if (!isMobile) {
                gsap.to('#overlay-3', {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: heroSection,
                        start: '45% top',
                        end: '48% top',
                        scrub: 0.5,
                    }
                });
                gsap.to('#overlay-3', {
                    opacity: 0,
                    scrollTrigger: {
                        trigger: heroSection,
                        start: '67% top',
                        end: '70% top',
                        scrub: 0.5,
                    }
                });
            }

            // 4. OVERLAY 4: Final CTA Text (60-100%) (Fix #1)
            gsap.to('#overlay-4', {
                opacity: 1,
                scrollTrigger: {
                    trigger: heroSection,
                    start: '60% top',
                    end: '63% top',
                    scrub: 0.5,
                }
            });

            // 5. BOOKING FORM REVEAL (65-70%) (Fix #1)
            const bookingForm = document.getElementById('booking-form');
            if (bookingForm) {
                gsap.to(bookingForm, {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: heroSection,
                        start: '65% top',
                        end: '70% top',
                        scrub: 0.5,
                        onUpdate: (self) => {
                            const opacity = self.progress;
                            bookingForm.style.opacity = opacity;
                            if (opacity > 0.1) { // Only enable clicks when visible enough
                                bookingForm.classList.remove('pointer-events-none');
                                bookingForm.classList.add('pointer-events-auto');
                            } else {
                                bookingForm.classList.add('pointer-events-none');
                                bookingForm.classList.remove('pointer-events-auto');
                            }
                        }
                    }
                });
            }

            // 6. SCROLL INDICATOR FADE-OUT (5-10%)
            const scrollIndicator = document.querySelector('.hero-scroll-indicator');
            if (scrollIndicator) {
                gsap.to(scrollIndicator, {
                    opacity: 0,
                    scrollTrigger: {
                        trigger: heroSection,
                        start: '5% top',
                        end: '10% top',
                        scrub: 0.5,
                    }
                });
            }

            console.log('✓ Hero text overlays initialized');
        }

        function adjustOverlaysForMobile() {
            if (window.innerWidth < 768) {
                // Hide overlay-3 completely on mobile
                const overlay3 = document.getElementById('overlay-3');
                if (overlay3) overlay3.style.display = 'none';
                
                // Position adjustments for Overlay 4 and Form
                const overlay4 = document.getElementById('overlay-4');
                if (overlay4) {
                    overlay4.style.top = '30%';
                    overlay4.style.transform = 'translate(-50%, 0)';
                }
                
                const bookingForm = document.getElementById('booking-form');
                if (bookingForm) {
                    bookingForm.style.bottom = '5vh';
                }
            }
        }

        // Debounced resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                // Redraw current active frame at new size
                if (activeFrameIndex >= 0 && frames[activeFrameIndex]) {
                    requestAnimationFrame(() => drawFrame(activeFrameIndex));
                }
            }, 150);
        });

        // Initialize
        resizeCanvas();
        loadFrames();
    }
});
