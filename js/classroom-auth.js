/**
 * Classroom Authentication System
 * Card swipe authentication for instructor-only pages
 * Session persists for 8 hours in sessionStorage
 */

(function() {
    'use strict';

    // CONFIGURATION - Update with your instructor card pattern
    const INSTRUCTOR_CARD_PATTERN = 'LASTNAME/FIRSTNAME'; // TODO: Update with actual card data
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

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #auth-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(0, 102, 155, 0.95), rgba(0, 158, 219, 0.95));
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                font-family: 'Courier Prime', 'IBM Plex Mono', monospace;
            }

            .auth-content {
                background: white;
                padding: 50px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 500px;
                width: 90%;
            }

            .auth-icon {
                font-size: 4em;
                margin-bottom: 20px;
            }

            .auth-content h2 {
                color: #00669b;
                margin-bottom: 15px;
                font-size: 1.8em;
            }

            .auth-content p {
                color: #043d5d;
                margin-bottom: 10px;
                font-size: 1.1em;
            }

            .auth-instruction {
                font-weight: 600;
                margin-top: 20px !important;
            }

            #card-swipe-input {
                width: 100%;
                padding: 15px;
                margin: 20px 0;
                border: 2px solid #009edb;
                border-radius: 10px;
                font-size: 1.1em;
                font-family: 'Courier Prime', monospace;
                text-align: center;
            }

            #card-swipe-input:focus {
                outline: none;
                border-color: #00669b;
                box-shadow: 0 0 0 3px rgba(0, 102, 155, 0.1);
            }

            .auth-message {
                min-height: 30px;
                margin: 15px 0;
                font-weight: 600;
            }

            .auth-message.success {
                color: #10b981;
            }

            .auth-message.error {
                color: #ef4444;
            }

            .auth-help {
                margin-top: 20px;
                color: #6b7280;
            }

            .auth-help small {
                font-size: 0.9em;
            }
        `;

        document.head.appendChild(style);
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
