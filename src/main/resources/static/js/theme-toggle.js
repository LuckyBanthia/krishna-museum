/**
 * Initializes theme settings from local storage and injects toggle control.
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'krishna';
    applyTheme(savedTheme);
    createThemeToggle();
}

/**
 * Applies the selected theme class to document body and saves preference.
 * @param {string} theme - Theme name ('day' or 'krishna').
 */
function applyTheme(theme) {
    document.body.classList.remove('day-theme', 'krishna-theme');

    if (theme === 'day') {
        document.body.classList.add('day-theme');
    } else {
        document.body.classList.add('krishna-theme');
    }

    localStorage.setItem('theme', theme);
}

/**
 * Creates and appends the theme toggle button to the document body if not present.
 */
function createThemeToggle() {
    if (document.getElementById('theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.innerHTML = getThemeIcon();
    toggle.onclick = toggleTheme;
    
    document.body.appendChild(toggle);
}

/**
 * Returns the icon associated with the current theme.
 * @returns {string} Icon character.
 */
function getThemeIcon() {
    const currentTheme = localStorage.getItem('theme') || 'krishna';
    return currentTheme === 'day' ? '🌙' : '🕉️';
}

/**
 * Toggles between available themes and displays a notification.
 */
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'krishna';
    const newTheme = currentTheme === 'day' ? 'krishna' : 'day';

    applyTheme(newTheme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.innerHTML = getThemeIcon();
        toggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            toggle.style.transform = 'rotate(0deg)';
        }, 300);
    }

    showToast(`Switched to ${newTheme} mode!`, 'success');
}

// Bootstrap theme on DOM content loaded
document.addEventListener('DOMContentLoaded', initializeTheme);
