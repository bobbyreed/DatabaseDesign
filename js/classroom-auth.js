/**
 * Classroom Authentication System
 * Card swipe authentication for instructor-only pages
 * Session persists for 8 hours in sessionStorage
 */

(function() {
    'use strict';

    // CONFIGURATION - Update with your instructor card pattern
    const INSTRUCTOR_CARD_PATTERN = `REED/BOBBY`; 
    const AUTH_KEY = 'classroom_auth';
    const AUTH_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

    /**
     * Parse card swipe data to extract name
     * Expected format: %B...^LASTNAME/FIRSTNAME^...?
     */
    function parseCardData(rawData) {
        const match = rawData.match(/\^([^\/]+)\/([^\^]+)\^/);
        if (match) {
            const lastName = match[1].trim();
            const firstName = match[2].trim();
            return `${lastName}/${firstName}`;
        }
        return null;
    }

    /**
     * Check if user is authenticated and session hasn't expired
     */
    function isAuthenticated() {
        const authData = sessionStorage.getItem(AUTH_KEY);
        if (!authData) return false;

        try {
            const data = JSON.parse(authData);
            const now = new Date().getTime();
            const elapsed = now - data.timestamp;

            if (elapsed > AUTH_TIMEOUT) {
                sessionStorage.removeItem(AUTH_KEY);
                return false;
            }

            return true;
        } catch (e) {
            sessionStorage.removeItem(AUTH_KEY);
            return false;
        }
    }

    /**
     * Authenticate user with card data
     */
    function authenticate(cardData) {
        const parsed = parseCardData(cardData);

        if (parsed === INSTRUCTOR_CARD_PATTERN) {
            const authData = {
                authenticated: true,
                timestamp: new Date().getTime()
            };
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(authData));
            return true;
        }
        return false;
    }

    /**
     * Logout and clear session
     */
    function logout() {
        sessionStorage.removeItem(AUTH_KEY);
        location.reload();
    }

    /**
     * Initialize authentication UI overlay
     * @param {Object} options - Configuration options
     * @param {string} options.pageName - Name of the page being protected
     * @param {Function} options.onSuccess - Callback after successful authentication
     */
    function initAuthUI(options = {}) {
        const { pageName = 'Page', onSuccess = () => {} } = options;

        // Check if already authenticated
        if (isAuthenticated()) {
            onSuccess();
            return;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-content">
                <div class="auth-icon">🔒</div>
                <h2>Instructor Authentication Required</h2>
                <p>This page (${pageName}) requires instructor authentication.</p>
                <p class="auth-instruction">Please swipe your instructor card to continue.</p>
                <input type="text" id="card-swipe-input" autocomplete="off" />
                <div class="auth-message" id="auth-message"></div>
                <div class="auth-help">
                    <small>Card swipe not working? Check that the input field is focused.</small>
                </div>
            </div>
        `;

        // Auth styles are now in attendance.css
        document.body.appendChild(overlay);

        // Setup card swipe handler
        const input = document.getElementById('card-swipe-input');
        const message = document.getElementById('auth-message');

        // Auto-focus input
        input.focus();

        // Re-focus if user clicks anywhere
        overlay.addEventListener('click', () => input.focus());

        let cardBuffer = '';
        let cardTimeout = null;

        input.addEventListener('input', (e) => {
            cardBuffer = e.target.value;

            // Clear previous timeout
            if (cardTimeout) clearTimeout(cardTimeout);

            // Check for card terminator (?) or if data looks complete
            if (cardBuffer.includes('?')) {
                processCard(cardBuffer);
            } else {
                // Set timeout to process if no more input
                cardTimeout = setTimeout(() => {
                    if (cardBuffer.length > 20) {
                        processCard(cardBuffer);
                    }
                }, 500);
            }
        });

        function processCard(data) {
            if (authenticate(data)) {
                message.className = 'auth-message success';
                message.textContent = '✓ Authentication successful!';

                setTimeout(() => {
                    overlay.remove();
                    onSuccess();
                }, 1000);
            } else {
                message.className = 'auth-message error';
                message.textContent = '✗ Invalid card. Please try again.';
                input.value = '';
                cardBuffer = '';

                setTimeout(() => {
                    message.textContent = '';
                    message.className = 'auth-message';
                }, 3000);
            }
        }

        // Prevent page navigation while authenticating
        window.addEventListener('beforeunload', (e) => {
            if (!isAuthenticated()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    // Export to window
    window.ClassroomAuth = {
        isAuthenticated,
        authenticate,
        logout,
        initAuthUI
    };

    console.log('Classroom Authentication System loaded');
})();
