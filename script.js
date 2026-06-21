/* ==========================================
   ATLAS GYM - INTERACTIVE ENGINE (script.js)
   Vanilla JS powering premium states & UX
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DATA STRUCTURES
    // ==========================================

    const PROGRAMS_DATA = {
        apollo: {
            title: "Apollo Burns",
            subtitle: "Weight Loss Program",
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
            desc: "Apollo Burns is our signature high-intensity metabolic conditioning system designed to torch calories during and long after your workout. Combining cardiovascular intervals, resistance circuits, and functional athletic drills, this program is engineered to build relentless stamina and lean definition.",
            intensity: "High (HIIT / Cardio)",
            duration: "45 Mins / Session",
            schedule: "Mon, Wed, Fri at 7:00 AM & 6:30 PM",
            trainer: "Helena V., Cardio Specialist & Nutritionist",
            perks: [
                "Real-time heart-rate tracking",
                "Post-workout metabolic analysis",
                "Custom fat-loss nutritional blueprint",
                "Access to dynamic group classes"
            ]
        },
        heracles: {
            title: "Heracles Growth",
            subtitle: "Muscle Building Program",
            image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
            desc: "Heracles Growth focuses on progressive overload hypertrophy and strength training. Led by champion powerlifters and bodybuilders, you will master compound lifts, isolate muscle groups with specialized equipment, and learn the science of optimal muscle recovery and mass gain.",
            intensity: "Maximum (Strength / Hypertrophy)",
            duration: "60 Mins / Session",
            schedule: "Tue, Thu, Sat at 8:00 AM & 7:00 PM",
            trainer: "Marcus T., Master Powerlifter & Biochemist",
            perks: [
                "1-on-1 progressive weight progression assessment",
                "Advanced biomechanics lifts audit",
                "Protein synthesis macro-nutritional diet planner",
                "Access to competitive lifting platform rooms"
            ]
        },
        artemis: {
            title: "Artemis Fit",
            subtitle: "Woman Fitness",
            image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=800&auto=format&fit=crop",
            desc: "Empower your body with strength, tone, and confidence. Artemis Fit merges core stabilization, low-impact posture styling, and metabolic resistance to tone your muscles and optimize athletic health. Focus on glute development, hip mobility, and lean muscle building in a safe environment.",
            intensity: "Medium-High (Tone & Tone)",
            duration: "50 Mins / Session",
            schedule: "Mon, Tue, Thu at 9:00 AM & 5:30 PM",
            trainer: "Diana K., Women's Athletic Strength Coach",
            perks: [
                "Pelvic floor & deep core stability focus",
                "Hormonal phase cycle alignment advice",
                "Private studio training access",
                "Artemis elite recovery suite access"
            ]
        }
    };

    const MEMBERSHIP_TIERS = {
        standard: {
            name: "ATHLETE STANDARD",
            price: "29",
            desc: "Access to high-performance facilities and standard amenities."
        },
        elite: {
            name: "OLYMPUS ELITE",
            price: "59",
            desc: "Our most popular tier. Designed for serious gym-goers seeking full access."
        },
        vip: {
            name: "ZEUS VIP CLUB",
            price: "99",
            desc: "The ultimate luxury experience. Full VIP access and personal coaching."
        }
    };

    // ==========================================
    // 2. HEADER SCROLL & NAVIGATION
    // ==========================================

    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchors
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                // Close mobile menu if open
                closeMobileDrawer();

                const headerOffset = header.offsetHeight;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ==========================================
    // 3. MOBILE MENU DRAWER
    // ==========================================

    const menuBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('mobileNavClose');
    const overlay = document.getElementById('mobileOverlay');
    const drawer = document.getElementById('mobileNav');

    function openMobileDrawer() {
        overlay.classList.add('open');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        overlay.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMobileDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);
    if (overlay) overlay.addEventListener('click', closeMobileDrawer);

    // ==========================================
    // 4. ACTIVE NAVIGATION HIGHLIGHT (SCROLL SPY)
    // ==========================================

    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollPosition = window.scrollY + header.offsetHeight + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const targetLinks = document.querySelectorAll(`a[href="#${id}"]`);

            if (scrollPosition >= top && scrollPosition < top + height) {
                targetLinks.forEach(link => link.classList.add('active'));
            } else {
                targetLinks.forEach(link => link.classList.remove('active'));
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Run initial spy

    // ==========================================
    // 5. DETAILED PROGRAMS MODAL
    // ==========================================

    const modal = document.getElementById('programModal');
    const modalClose = document.getElementById('modalClose');
    const programBtnLearns = document.querySelectorAll('.program-btn-learn');

    // Modal Content Placeholders
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalSpecIntensity = document.getElementById('modalSpecIntensity');
    const modalSpecDuration = document.getElementById('modalSpecDuration');
    const modalSpecSchedule = document.getElementById('modalSpecSchedule');
    const modalSpecTrainer = document.getElementById('modalSpecTrainer');
    const modalPerksList = document.getElementById('modalPerksList');
    const modalEnrollBtn = document.getElementById('modalEnrollBtn');

    function openProgramModal(programKey) {
        const data = PROGRAMS_DATA[programKey];
        if (!data) return;

        // Populate Modal Fields
        modalImg.src = data.image;
        modalImg.alt = data.title;
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalDesc.textContent = data.desc;
        modalSpecIntensity.textContent = data.intensity;
        modalSpecDuration.textContent = data.duration;
        modalSpecSchedule.textContent = data.schedule;
        modalSpecTrainer.textContent = data.trainer;

        // Render perks list
        modalPerksList.innerHTML = '';
        data.perks.forEach(perk => {
            const li = document.createElement('li');
            li.className = 'modal-perk-item';
            li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${perk}</span>`;
            modalPerksList.appendChild(li);
        });

        // Setup CTA button
        modalEnrollBtn.setAttribute('data-program-name', data.title);

        // Open modal animations
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeProgramModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    programBtnLearns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const programKey = this.getAttribute('data-program');
            openProgramModal(programKey);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeProgramModal);
    
    // Close modal on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProgramModal();
            }
        });
    }

    // Connect Modal CTA to Registration Form
    if (modalEnrollBtn) {
        modalEnrollBtn.addEventListener('click', function() {
            const programName = this.getAttribute('data-program-name');
            const formProgramSelect = document.getElementById('joinProgram');
            
            if (formProgramSelect) {
                // Find matching option text
                for (let i = 0; i < formProgramSelect.options.length; i++) {
                    if (formProgramSelect.options[i].text === programName) {
                        formProgramSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            closeProgramModal();
            
            // Scroll to join section
            const joinSection = document.getElementById('join');
            if (joinSection) {
                const offsetPosition = joinSection.offsetTop - header.offsetHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    }

    // ==========================================
    // 6. FACILITIES TABS SWAP
    // ==========================================

    const facilityTabBtns = document.querySelectorAll('.facility-tab-btn');
    const facilityContentPanels = document.querySelectorAll('.facility-content-panel');

    facilityTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabTarget = this.getAttribute('data-tab');

            // Remove active class from buttons
            facilityTabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to current button
            this.classList.add('active');

            // Toggle active panel
            facilityContentPanels.forEach(panel => {
                if (panel.getAttribute('id') === `facility-${tabTarget}`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // ==========================================
    // 7. TESTIMONIALS SLIDER
    // ==========================================

    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    let currentSlide = 0;
    let autoplayTimer;

    function showSlide(index) {
        // Wrap around bounds
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoplay() {
        stopAutoplay(); // clear existing
        autoplayTimer = setInterval(nextSlide, 8000);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay(); // Reset timer on click
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoplay(); // Reset timer on click
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-slide-index'));
            showSlide(index);
            startAutoplay(); // Reset timer on click
        });
    });

    // Start testimonials carousel
    if (slides.length > 0) {
        showSlide(0);
        startAutoplay();
    }

    // ==========================================
    // 8. MULTI-STEP MEMBERSHIP WIZARD
    // ==========================================

    let formStep = 1;
    let selectedTier = "elite";

    const stepIndicatorDots = document.querySelectorAll('.step-indicator-dot');
    const wizardStepPanels = document.querySelectorAll('.wizard-step-panel');
    const prevStepBtn = document.getElementById('wizardPrev');
    const nextStepBtn = document.getElementById('wizardNext');

    // Inputs
    const tierCards = document.querySelectorAll('.tier-select-card');
    const nameInput = document.getElementById('joinName');
    const emailInput = document.getElementById('joinEmail');
    const phoneInput = document.getElementById('joinPhone');
    const programSelect = document.getElementById('joinProgram');
    const errorMsg = document.getElementById('formError');

    // Success elements
    const successTier = document.getElementById('successTier');
    const successName = document.getElementById('successName');
    const successEmail = document.getElementById('successEmail');
    const successPhone = document.getElementById('successPhone');
    const successProgram = document.getElementById('successProgram');
    const successCode = document.getElementById('successCode');
    const ticketVipTag = document.getElementById('ticketVipTag');

    // Tier Card selection
    tierCards.forEach(card => {
        card.addEventListener('click', function() {
            tierCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedTier = this.getAttribute('data-tier');
        });
    });

    function updateWizardUI() {
        // Update Step Panels
        wizardStepPanels.forEach(panel => {
            if (parseInt(panel.getAttribute('data-step')) === formStep) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Update Dots
        stepIndicatorDots.forEach((dot, idx) => {
            const stepNum = idx + 1;
            dot.className = 'step-indicator-dot';
            if (stepNum === formStep) {
                dot.classList.add('active');
            } else if (stepNum < formStep) {
                dot.classList.add('completed');
            }
        });

        // Update Buttons Visibility
        if (formStep === 1) {
            prevStepBtn.style.display = 'none';
            nextStepBtn.textContent = 'CONTINUE';
        } else if (formStep === 2) {
            prevStepBtn.style.display = 'inline-flex';
            nextStepBtn.textContent = 'JOIN ATLAS';
        } else if (formStep === 3) {
            prevStepBtn.style.display = 'none';
            nextStepBtn.textContent = 'JOIN ANOTHER TIER';
        }
    }

    function validateStep2() {
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();

        if (nameVal.length < 3) {
            showFormError("Please enter your full name (minimum 3 characters).");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            showFormError("Please enter a valid email address.");
            return false;
        }

        if (phoneVal.length < 6) {
            showFormError("Please enter a valid contact phone number.");
            return false;
        }

        hideFormError();
        return true;
    }

    function showFormError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    function hideFormError() {
        errorMsg.style.display = 'none';
    }

    function generateConfirmation() {
        const tier = MEMBERSHIP_TIERS[selectedTier];
        const confirmationCode = "ATL-" + Math.floor(100000 + Math.random() * 900000);

        // Populate success ticket
        successTier.textContent = tier.name;
        successName.textContent = nameInput.value.trim();
        successEmail.textContent = emailInput.value.trim();
        successPhone.textContent = phoneInput.value.trim();
        successProgram.textContent = programSelect.value;
        successCode.textContent = confirmationCode;

        // Toggle VIP visual badge on ticket
        if (selectedTier === 'vip') {
            ticketVipTag.style.display = 'inline-block';
        } else {
            ticketVipTag.style.display = 'none';
        }
    }

    function resetForm() {
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        programSelect.selectedIndex = 0;
        
        // select elite tier as default
        tierCards.forEach(c => c.classList.remove('selected'));
        const defaultTierCard = document.querySelector('[data-tier="elite"]');
        if (defaultTierCard) {
            defaultTierCard.classList.add('selected');
        }
        selectedTier = "elite";
        hideFormError();
    }

    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (formStep === 1) {
                formStep = 2;
                updateWizardUI();
            } else if (formStep === 2) {
                if (validateStep2()) {
                    generateConfirmation();
                    formStep = 3;
                    updateWizardUI();
                }
            } else if (formStep === 3) {
                // Reset form completely & start over
                resetForm();
                formStep = 1;
                updateWizardUI();
            }
        });
    }

    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', () => {
            if (formStep > 1) {
                formStep--;
                hideFormError();
                updateWizardUI();
            }
        });
    }

    // Initialize wizard buttons
    if (prevStepBtn && nextStepBtn) {
        updateWizardUI();
    }

    // ==========================================
    // 9. RADAR NAVIGATION ROUTER (ETA SIMULATOR)
    // ==========================================

    const routeForm = document.getElementById('routeForm');
    const startLocInput = document.getElementById('startLocation');
    const resultBox = document.getElementById('routeResult');
    const resultText = document.getElementById('routeResultText');
    const resultIcon = document.getElementById('routeResultIcon');

    if (routeForm) {
        routeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const location = startLocInput.value.trim();

            if (!location) {
                return;
            }

            // Set result box to loading state
            resultBox.className = 'route-result-box active loading';
            resultIcon.className = 'fa-solid fa-spinner fa-spin route-result-icon';
            resultText.innerHTML = 'Analyzing satellite coordinates and traffic...';

            setTimeout(() => {
                const minutes = Math.floor(Math.random() * 12) + 3;
                resultBox.className = 'route-result-box active';
                resultIcon.className = 'fa-solid fa-compass route-result-icon';
                resultText.innerHTML = `Route calculated! You are approximately <strong>${minutes} minutes</strong> away from Atlas Gym via Olympus Street. Standard traffic conditions apply.`;
            }, 1500);
        });
    }
});
