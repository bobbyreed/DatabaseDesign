class PresentationController {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.timerInterval = null;
        this.currentTheme = localStorage.getItem('ocuTheme') || 'light';
        this.hideControlsTimer = null;
        this.hideDelay = 2000; // 2 seconds of inactivity

        this.init();
    }

    init() {
        // Initialize theme FIRST before anything else
        this.initializeTheme();

        // Create merged top controls
        this.createTopControls();

        // Initialize slide counter display
        this.updateSlideCounter();

        // Show first slide
        this.showSlide(0);

        // Bind navigation buttons
        this.bindNavigationButtons();

        // Bind keyboard navigation
        this.bindKeyboardNavigation();

        // Initialize any timers if present
        this.initializeTimers();

        // Set up auto-hide controls
        this.initializeAutoHide();

        // Initialize clipboard copy functionality
        this.initializeClipboardCopy();
    }

    initializeTheme() {
        // Apply saved theme immediately
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    createTopControls() {
        // Get lecture title from timer-display if it exists
        const timerDisplay = document.querySelector('.timer-display');
        const lectureTitle = timerDisplay ? timerDisplay.querySelector('#timer-text')?.childNodes[0]?.textContent?.trim() || 'Lecture' : 'Lecture';
        const homeButton = timerDisplay ? timerDisplay.querySelector('.home')?.innerHTML || '' : '';

        const controlsHTML = `
            <div class="top-controls">
                <div class="control-tab">⚙️</div>
                <div class="lecture-info">
                    <span>${lectureTitle}</span>
                    ${homeButton ? `<button class="home">${homeButton}</button>` : ''}
                </div>
                <div class="theme-toggle">
                    <span class="theme-toggle-label">Light</span>
                    <label class="theme-switch">
                        <input type="checkbox" id="theme-checkbox" ${this.currentTheme === 'dark' ? 'checked' : ''}>
                        <span class="theme-slider"></span>
                    </label>
                    <span class="theme-toggle-label">Dark</span>
                </div>
            </div>
        `;

        // Insert at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', controlsHTML);

        // Bind theme toggle
        setTimeout(() => {
            const themeToggle = document.querySelector('#theme-checkbox');
            if (themeToggle) {
                themeToggle.checked = this.currentTheme === 'dark';
                themeToggle.removeEventListener('change', this.handleThemeChange);
                themeToggle.addEventListener('change', this.handleThemeChange.bind(this));
            }
        }, 0);

        // Add tab to navigation
        const navigation = document.querySelector('.navigation');
        if (navigation && !navigation.querySelector('.nav-tab')) {
            navigation.insertAdjacentHTML('afterbegin', '<div class="nav-tab">◀▶</div>');
        }
    }

    handleThemeChange(e) {
        this.currentTheme = e.target.checked ? 'dark' : 'light';
        this.applyTheme();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // Update checkbox if it exists
        const checkbox = document.querySelector('#theme-checkbox');
        if (checkbox) {
            checkbox.checked = this.currentTheme === 'dark';
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('ocuTheme', this.currentTheme);
    }

    showSlide(n) {
        // Hide current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }

        // Calculate new slide index with wrapping
        this.currentSlide = (n + this.totalSlides) % this.totalSlides;

        // Show new slide
        this.slides[this.currentSlide].classList.add('active');

        // Update counter and button states
        this.updateSlideCounter();
        this.updateButtonStates();

        // Trigger slide change event for custom handlers
        this.triggerSlideChangeEvent();
    }

    changeSlide(direction) {
        this.showSlide(this.currentSlide + direction);
    }

    updateSlideCounter() {
        const currentSlideElement = document.getElementById('currentSlide');
        const totalSlidesElement = document.getElementById('totalSlides');

        if (currentSlideElement) {
            currentSlideElement.textContent = this.currentSlide + 1;
        }

        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }
    }

    updateButtonStates() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }
    }

    bindNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.onclick = null;
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeSlide(-1);
            });
        }

        if (nextBtn) {
            nextBtn.onclick = null;
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeSlide(1);
            });
        }
    }

    bindKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    if (this.currentSlide > 0) {
                        this.changeSlide(-1);
                    }
                    break;

                case 'ArrowRight':
                    if (this.currentSlide < this.totalSlides - 1) {
                        this.changeSlide(1);
                    }
                    break;

                case ' ':
                    e.preventDefault();
                    if (this.currentSlide < this.totalSlides - 1) {
                        this.changeSlide(1);
                    }
                    break;

                case 'Home':
                    e.preventDefault();
                    this.showSlide(0);
                    break;

                case 'End':
                    e.preventDefault();
                    this.showSlide(this.totalSlides - 1);
                    break;

                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;

                case 't':
                case 'T':
                    e.preventDefault();
                    this.toggleTheme();
                    break;

                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    initializeTimers() {
        // Look for timer buttons and bind them
        const timerButtons = document.querySelectorAll('[data-timer]');
        timerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const minutes = parseInt(button.dataset.timer);
                this.startTimer(minutes);
            });
        });
    }

    startTimer(minutes) {
        const timerDisplay = document.getElementById('timer-display');
        const timerText = document.getElementById('timer-text');

        if (!timerDisplay || !timerText) return;

        // Clear existing timer if any
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Clear any existing stop button
        const existingBtn = timerDisplay.querySelector('.timer-stop-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        // Create stop button
        const stopBtn = document.createElement('button');
        stopBtn.className = 'timer-stop-btn';
        stopBtn.textContent = 'Stop Timer';
        stopBtn.onclick = () => this.stopTimer();
        timerDisplay.appendChild(stopBtn);

        timerDisplay.style.display = 'block';
        let timeLeft = minutes * 60;
        const totalTime = minutes * 60;

        // Remove any existing warning classes
        timerText.classList.remove('time-warning', 'time-critical');

        this.timerInterval = setInterval(() => {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerText.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

            // Add visual warnings
            const percentLeft = timeLeft / totalTime;
            timerText.classList.remove('time-warning', 'time-critical');

            if (percentLeft <= 0.1) { // Last 10%
                timerText.classList.add('time-critical');
            } else if (percentLeft <= 0.25) { // Last 25%
                timerText.classList.add('time-warning');
            }

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                timerText.textContent = "Time's Up!";
                timerText.classList.remove('time-warning');
                timerText.classList.add('time-critical');
                this.playTimerSound();
            }

            timeLeft--;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const timerDisplay = document.getElementById('timer-display');
        const timerText = document.getElementById('timer-text');

        if (timerDisplay) {
            timerDisplay.style.display = 'none';

            // Remove stop button
            const stopBtn = timerDisplay.querySelector('.timer-stop-btn');
            if (stopBtn) {
                stopBtn.remove();
            }
        }

        if (timerText) {
            timerText.classList.remove('time-warning', 'time-critical');
        }
    }

    playTimerSound() {
        // Create a simple beep sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Could not play timer sound:', e);
        }
    }

    triggerSlideChangeEvent() {
        const event = new CustomEvent('slidechange', {
            detail: {
                currentSlide: this.currentSlide,
                totalSlides: this.totalSlides
            }
        });
        document.dispatchEvent(event);

        // Built-in logging (can be disabled via data attribute)
        if (!document.body.dataset.disableLogging) {
            console.log(`Slide ${this.currentSlide + 1} of ${this.totalSlides}`);
        }

        // Auto-animate elements on slide change
        this.animateSlideElements();
    }

    animateSlideElements() {
        const currentSlideElement = this.slides[this.currentSlide];
        if (!currentSlideElement) return;

        // Animate formula boxes and calculus examples
        const formulas = currentSlideElement.querySelectorAll('.formula-box, .calculus-example');
        formulas.forEach((formula, index) => {
            formula.style.transition = 'all 0.3s ease';
            formula.style.opacity = '0';
            formula.style.transform = 'translateY(10px)';

            setTimeout(() => {
                formula.style.opacity = '1';
                formula.style.transform = 'translateY(0)';
            }, index * 100 + 100);
        });

        // Animate ERD diagrams
        const diagrams = currentSlideElement.querySelectorAll('.erd-diagram pre');
        diagrams.forEach((diagram, index) => {
            diagram.style.transition = 'all 0.5s ease';
            diagram.style.opacity = '0';
            diagram.style.transform = 'translateY(20px)';

            setTimeout(() => {
                diagram.style.opacity = '1';
                diagram.style.transform = 'translateY(0)';
            }, index * 200 + 100);
        });

        // Animate SQL examples
        const sqlExamples = currentSlideElement.querySelectorAll('.sql-example');
        sqlExamples.forEach((example, index) => {
            example.style.transition = 'all 0.5s ease';
            example.style.opacity = '0';
            example.style.transform = 'translateX(-10px)';

            setTimeout(() => {
                example.style.opacity = '1';
                example.style.transform = 'translateX(0)';
            }, index * 150 + 100);
        });

        // Animate code examples
        const codeExamples = currentSlideElement.querySelectorAll('.code-example, .command-box');
        codeExamples.forEach((code, index) => {
            code.style.transition = 'all 0.5s ease';
            code.style.opacity = '0';
            code.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                code.style.opacity = '1';
                code.style.transform = 'translateX(0)';
            }, index * 150 + 100);
        });
    }

    // Copy to clipboard functionality for code blocks
    initializeClipboardCopy() {
        const codeBlocks = document.querySelectorAll('.sql-example, .code-example');
        codeBlocks.forEach(block => {
            // Only add if not already added
            if (block.dataset.clipboardInitialized) return;

            block.style.cursor = 'pointer';
            block.title = 'Click to copy';

            block.addEventListener('click', function() {
                const text = this.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    // Show feedback
                    const originalBg = this.style.backgroundColor;
                    this.style.backgroundColor = 'var(--ocu-green, #28a745)';
                    this.style.transition = 'background-color 0.3s ease';

                    setTimeout(() => {
                        this.style.backgroundColor = originalBg;
                    }, 500);

                    console.log('Code copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            });

            block.dataset.clipboardInitialized = 'true';
        });
    }

    // Public methods for external use
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 0 && slideNumber < this.totalSlides) {
            this.showSlide(slideNumber);
        }
    }

    initializeAutoHide() {
        const topControls = document.querySelector('.top-controls');
        const navigation = document.querySelector('.navigation');
        const controlTab = document.querySelector('.control-tab');
        const navTab = document.querySelector('.nav-tab');

        if (!topControls || !navigation) return;

        // Show controls on activity
        const showControls = () => {
            topControls.classList.remove('controls-hidden');
            navigation.classList.remove('controls-hidden');
            this.resetHideTimer();
        };

        // Reset the hide timer
        this.resetHideTimer = () => {
            if (this.hideControlsTimer) {
                clearTimeout(this.hideControlsTimer);
            }
            this.hideControlsTimer = setTimeout(() => {
                topControls.classList.add('controls-hidden');
                navigation.classList.add('controls-hidden');
            }, this.hideDelay);
        };

        // Show controls on mouse movement
        document.addEventListener('mousemove', showControls);

        // Show controls on keyboard activity
        document.addEventListener('keydown', showControls);

        // Show controls when hovering over tabs
        if (controlTab) {
            controlTab.addEventListener('mouseenter', () => {
                topControls.classList.remove('controls-hidden');
            });
        }

        if (navTab) {
            navTab.addEventListener('mouseenter', () => {
                navigation.classList.remove('controls-hidden');
            });
        }

        // Keep controls visible when hovering over them
        topControls.addEventListener('mouseenter', () => {
            if (this.hideControlsTimer) {
                clearTimeout(this.hideControlsTimer);
            }
        });

        topControls.addEventListener('mouseleave', () => {
            this.resetHideTimer();
        });

        navigation.addEventListener('mouseenter', () => {
            if (this.hideControlsTimer) {
                clearTimeout(this.hideControlsTimer);
            }
        });

        navigation.addEventListener('mouseleave', () => {
            this.resetHideTimer();
        });

        // Start initial hide timer
        this.resetHideTimer();
    }
}

// Initialize presentation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new PresentationController();
});

// Helper function for quick timer creation
function createTimer(minutes, message = 'Work Time') {
    const button = document.createElement('button');
    button.textContent = `Start ${minutes}-Minute Timer`;
    button.dataset.timer = minutes;
    button.style.marginTop = '20px';
    return button;
}

// Expose startTimer function globally for onclick attributes
function startTimer(minutes) {
    if (window.presentation) {
        window.presentation.startTimer(minutes);
    }
}

// Expose changeSlide function globally for onclick attributes  
function changeSlide(direction) {
    if (window.presentation) {
        window.presentation.changeSlide(direction);
    }
}