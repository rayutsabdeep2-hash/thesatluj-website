/**
 * The Satluj — Main Interactivity Script
 * Version: 1.1.0
 * Dependencies: None (Vanilla JS)
 */

document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    // ----------------------------------------------------------------------
    // NAVIGATION SCROLL STATE
    // ----------------------------------------------------------------------
    const navWrap = document.getElementById("nav-wrap");
    const heroSection = document.getElementById("hero");

    if (navWrap && heroSection) {
        const navObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                navWrap.classList.add("nav-scrolled");
            } else {
                navWrap.classList.remove("nav-scrolled");
            }
        }, { threshold: 0 });

        navObserver.observe(heroSection);
    }

    // ----------------------------------------------------------------------
    // FADE-UP ANIMATIONS (IntersectionObserver)
    // ----------------------------------------------------------------------
    const fadeEls = document.querySelectorAll(".fade-up");
    const appearanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                appearanceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    fadeEls.forEach(el => appearanceObserver.observe(el));

    // Staggered items
    const staggerEls = document.querySelectorAll(".fade-up-stagger");
    staggerEls.forEach(el => appearanceObserver.observe(el));

    // ----------------------------------------------------------------------
    // CAFE PARALLAX (Native)
    // ----------------------------------------------------------------------
    const cafeSection = document.getElementById("cafe");
    const cafeBg = document.getElementById("cafe-bg");

    if (cafeSection && cafeBg) {
        window.addEventListener("scroll", function() {
            const rect = cafeSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.4;
                const yPos = -(rect.top * speed);
                cafeBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        }, { passive: true });
    }

    // ----------------------------------------------------------------------
    // MOBILE MENU & ACCESSIBILITY
    // ----------------------------------------------------------------------
    const menuBtn = document.getElementById("hamburger-btn");
    const closeBtn = document.getElementById("close-menu-btn");
    const menuOverlay = document.getElementById("menu-overlay");

    if (menuBtn && closeBtn && menuOverlay) {
        const focusableEls = menuOverlay.querySelectorAll("a, button");
        const firstFocusable = focusableEls[0];

        const toggleMenu = (show) => {
            menuOverlay.classList.toggle("translate-x-full", !show);
            document.body.style.overflow = show ? "hidden" : "";
            if (show && firstFocusable) firstFocusable.focus();
        };

        menuBtn.addEventListener("click", () => toggleMenu(true));
        closeBtn.addEventListener("click", () => toggleMenu(false));

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !menuOverlay.classList.contains("translate-x-full")) {
                toggleMenu(false);
                menuBtn.focus();
            }
        });

        menuOverlay.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => toggleMenu(false));
        });
    }

    // ----------------------------------------------------------------------
    // WHATSAPP
    // ----------------------------------------------------------------------
    const generateWaLink = (message) => {
        const phone = "919874068999";
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const heroBtn = document.getElementById("form-cta-btn");
    if (heroBtn) {
        heroBtn.addEventListener("click", () => {
            const checkin = document.getElementById("checkin").value;
            const checkout = document.getElementById("checkout").value;
            const guests = document.getElementById("guests").value;
            const msg = `Hi! Inquiry for ${guests} guests.\nCheck-in: ${checkin}\nCheck-out: ${checkout}`;
            window.open(generateWaLink(msg), "_blank");
        });
    }

    // ----------------------------------------------------------------------
    // ROOM CAROUSEL
    // ----------------------------------------------------------------------
    const carouselContainer = document.getElementById("room-carousel");
    const slides = document.querySelectorAll(".carousel-img");
    const dots = document.querySelectorAll(".carousel-dot");
    const status = document.getElementById("carousel-status");

    if (carouselContainer && slides.length > 0) {
        let currentIdx = 0;

        const updateCarousel = (newIdx) => {
            slides[currentIdx].classList.replace("opacity-100", "opacity-0");
            slides[currentIdx].classList.replace("z-10", "z-0");
            dots[currentIdx].classList.remove("active", "bg-white");
            dots[currentIdx].classList.add("bg-white/40");
            dots[currentIdx].setAttribute("aria-current", "false");

            currentIdx = newIdx;

            slides[currentIdx].classList.replace("opacity-0", "opacity-100");
            slides[currentIdx].classList.replace("z-0", "z-10");
            dots[currentIdx].classList.add("active", "bg-white");
            dots[currentIdx].classList.remove("bg-white/40");
            dots[currentIdx].setAttribute("aria-current", "true");
            
            // Fix: Force update status text
            if (status) {
                status.textContent = `Slide ${currentIdx + 1} of ${slides.length}`;
            }
        };

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => updateCarousel(i));
        });

        let touchStart = 0;
        carouselContainer.addEventListener("touchstart", e => touchStart = e.touches[0].clientX, {passive:true});
        carouselContainer.addEventListener("touchend", e => {
            const touchEnd = e.changedTouches[0].clientX;
            if (touchStart - touchEnd > 50) updateCarousel((currentIdx + 1) % slides.length);
            else if (touchStart - touchEnd < -50) updateCarousel((currentIdx - 1 + slides.length) % slides.length);
        }, {passive:true});
    }

    // ----------------------------------------------------------------------
    // ABOUT & GALLERY
    // ----------------------------------------------------------------------
    const aboutBtn = document.getElementById("about-story-btn");
    const aboutModal = document.getElementById("about-modal");
    const aboutClose = document.getElementById("about-close-btn");

    if (aboutBtn && aboutModal && aboutClose) {
        aboutBtn.addEventListener("click", () => {
            aboutModal.classList.remove("hidden", "opacity-0", "pointer-events-none");
            document.body.style.overflow = "hidden";
        });
        const closeAbout = () => {
            aboutModal.classList.add("opacity-0", "pointer-events-none");
            setTimeout(() => aboutModal.classList.add("hidden"), 300);
            document.body.style.overflow = "";
        };
        aboutClose.addEventListener("click", closeAbout);
        aboutModal.addEventListener("click", (e) => { if(e.target === aboutModal) closeAbout(); });
    }

    const galleryItems = document.querySelectorAll(".gallery-img");
    const lbox = document.getElementById("gallery-lightbox");
    const lboxImg = document.getElementById("lightbox-image");
    const lboxClose = document.getElementById("lightbox-close");

    if (lbox && lboxImg && galleryItems.length > 0) {
        galleryItems.forEach((item) => {
            item.addEventListener("click", () => {
                lboxImg.src = item.src;
                lbox.style.display = "flex";
                setTimeout(() => lbox.classList.replace("opacity-0", "opacity-100"), 10);
                document.body.style.overflow = "hidden";
            });
        });
        const closeLbox = () => {
            lbox.classList.replace("opacity-100", "opacity-0");
            setTimeout(() => { lbox.style.display = "none"; document.body.style.overflow = ""; }, 300);
        };
        lboxClose.addEventListener("click", closeLbox);
        lbox.addEventListener("click", (e) => { if(e.target === lbox) closeLbox(); });
    }

    const bookingBar = document.getElementById("booking-bar");
    const waFloatingBtn = document.getElementById("wa-btn");
    if (heroSection && bookingBar && waFloatingBtn) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            bookingBar.classList.toggle("visible", !entry.isIntersecting);
            bookingBar.classList.toggle("translate-y-full", entry.isIntersecting);
            waFloatingBtn.classList.toggle("wa-bump", !entry.isIntersecting);
        }, { threshold: 0 });
        scrollObserver.observe(heroSection);
    }
});
