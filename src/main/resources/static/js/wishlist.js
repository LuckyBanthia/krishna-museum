/**
 * Global toast notification helper.
 * @param {string} message - Message to display.
 * @param {string} [type='info'] - Notification style ('info', 'success', 'error').
 */
if (typeof window.showToast !== 'function') {
    window.showToast = function(message, type = 'info') {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.className = 'toast ' + type + ' show';
        toast.innerText = message;
        setTimeout(() => {
            toast.className = toast.className.replace('show', '').trim();
        }, 3000);
    };
}

/**
 * Updates UI counter badges displaying current wishlist item count.
 */
function updateWishlistBadges() {
    const count = typeof getWishlist === 'function' ? getWishlist().length : 0;
    document.querySelectorAll('.wishlist-counter-badge').forEach(badge => {
        badge.textContent = count;
    });
}

/**
 * Determines the localStorage key for the current user's wishlist.
 * @returns {string} Storage key name.
 */
function getWishlistStorageKey() {
    const username = sessionStorage.getItem('username');
    if (!username) return 'guest_wishlist';
    return 'wishlist_' + encodeURIComponent(username);
}

/**
 * Retrieves the list of wishlist artefact IDs for the active user.
 * @returns {number[]} Array of numeric artefact IDs.
 */
function getWishlist() {
    const key = getWishlistStorageKey();
    let raw = localStorage.getItem(key);
    
    if (!raw && key !== 'guest_wishlist') {
        const guestRaw = localStorage.getItem('guest_wishlist');
        if (guestRaw) {
            localStorage.setItem(key, guestRaw);
            raw = guestRaw;
        }
    }

    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
        return [];
    }
}

/**
 * Persists the wishlist array to localStorage.
 * @param {number[]} list - Array of artefact IDs.
 */
function saveWishlist(list) {
    const key = getWishlistStorageKey();
    const cleanList = Array.from(new Set(list.map(Number)));
    localStorage.setItem(key, JSON.stringify(cleanList));
    if (key !== 'guest_wishlist') {
        localStorage.setItem('guest_wishlist', JSON.stringify(cleanList));
    }
}

/**
 * Checks whether an artefact is present in the current user's wishlist.
 * @param {number|string} artefactId - Unique artefact ID.
 * @returns {boolean} True if in wishlist, false otherwise.
 */
function isArtefactInWishlist(artefactId) {
    return getWishlist().includes(Number(artefactId));
}

/**
 * Toggles an artefact in the wishlist (adds if absent, removes if present).
 * Updates UI buttons, counters, and synchronizes asynchronously with backend.
 * @param {number|string} artefactId - Unique artefact ID.
 */
function addToWishlist(artefactId) {
    const id = Number(artefactId);
    let wishlist = getWishlist();
    const isAlreadySaved = wishlist.includes(id);

    if (isAlreadySaved) {
        wishlist = wishlist.filter(item => item !== id);
        saveWishlist(wishlist);
        updateWishlistButtonUI(id, false);
        if (typeof showToast === 'function') {
            showToast('Removed from Wishlist', 'success');
        }
    } else {
        wishlist.push(id);
        saveWishlist(wishlist);
        updateWishlistButtonUI(id, true);
        if (typeof showToast === 'function') {
            showToast('Added to Wishlist', 'success');
        }
    }

    updateWishlistBadges();
    refreshAllWishlistButtons();

    fetch('/api/wishlist/toggle/' + id, { method: 'POST' }).catch(() => {});

    if (typeof renderWishlistPage === 'function') {
        renderWishlistPage();
    }
    if (typeof loadWishlistInDashboard === 'function') {
        loadWishlistInDashboard();
    }
    if (typeof calculateDashboardStats === 'function') {
        calculateDashboardStats();
    }
}

/**
 * Validates and updates the wishlist button state for a given artefact.
 * @param {number|string} artefactId - Unique artefact ID.
 */
function checkWishlist(artefactId) {
    const inWishlist = isArtefactInWishlist(artefactId);
    updateWishlistButtonUI(artefactId, inWishlist);
    updateWishlistBadges();
}

/**
 * Updates DOM buttons associated with a specific artefact ID.
 * @param {number|string} artefactId - Unique artefact ID.
 * @param {boolean} inWishlist - Current saved state.
 */
function updateWishlistButtonUI(artefactId, inWishlist) {
    const id = Number(artefactId);
    const buttons = document.querySelectorAll('button[data-wishlist-id="' + id + '"]');
    buttons.forEach(btn => {
        btn.innerHTML = inWishlist ? '❤️' : '🤍';
        if (inWishlist) {
            btn.classList.add('active', 'liked');
            btn.title = 'Remove from Wishlist';
        } else {
            btn.classList.remove('active', 'liked');
            btn.title = 'Add to Wishlist';
        }
    });
}

/**
 * Scans and updates all wishlist buttons currently in the DOM.
 */
function refreshAllWishlistButtons() {
    const list = getWishlist();
    document.querySelectorAll('button[data-wishlist-id]').forEach(btn => {
        const id = Number(btn.getAttribute('data-wishlist-id'));
        const inWishlist = list.includes(id);
        btn.innerHTML = inWishlist ? '❤️' : '🤍';
        if (inWishlist) {
            btn.classList.add('active', 'liked');
            btn.title = 'Remove from Wishlist';
        } else {
            btn.classList.remove('active', 'liked');
            btn.title = 'Add to Wishlist';
        }
    });
    updateWishlistBadges();
}

/**
 * Generates the storage key for artefact ratings and reviews.
 * @param {number|string} artefactId - Unique artefact ID.
 * @returns {string} Storage key name.
 */
function getRatingsStorageKey(artefactId) {
    return 'ratings_artefact_' + artefactId;
}

/**
 * Retrieves persisted ratings and reviews for an artefact.
 * @param {number|string} artefactId - Unique artefact ID.
 * @returns {Object} Object containing ratings array and reviews array.
 */
function getArtefactRatingsData(artefactId) {
    const raw = localStorage.getItem(getRatingsStorageKey(artefactId));
    if (!raw) {
        return {
            ratings: [5, 5, 4],
            reviews: [
                { user: "Priya Sharma", rating: 5, comment: "Exquisite craftsmanship and deep spiritual aura!", date: "2026-09-10" },
                { user: "Rahul Verma", rating: 5, comment: "Incredible historical detail and preservation.", date: "2026-09-14" }
            ]
        };
    }
    try {
        return JSON.parse(raw);
    } catch {
        return { ratings: [], reviews: [] };
    }
}

/**
 * Renders the rating summary and interactive star selector into the DOM.
 * @param {number|string} artefactId - Unique artefact ID.
 */
function displayStarRating(artefactId) {
    const container = document.getElementById('ratings-' + artefactId);
    if (!container) return;

    const data = getArtefactRatingsData(artefactId);
    const avg = data.ratings.length > 0 
        ? (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(1)
        : "5.0";

    container.innerHTML = `
        <div class="rating-box" style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.05); border-radius:10px; border:1px solid rgba(187,134,252,0.2);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                <div>
                    <h4 style="margin:0; color:#bb86fc;">Community Rating</h4>
                    <div style="font-size:22px; font-weight:bold; color:#fcd34d; margin-top:4px;">
                        ${avg} / 5.0 <span style="font-size:14px; color:#aaa; font-weight:normal;">(${data.ratings.length} ratings)</span>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:13px; color:#aaa; margin-bottom:4px;">Rate this artefact:</div>
                    <div class="star-rating-buttons" style="display:flex; gap:6px; cursor:pointer;">
                        <span onclick="submitRating(${artefactId}, 1)" style="font-size:20px;" title="1 Star">★</span>
                        <span onclick="submitRating(${artefactId}, 2)" style="font-size:20px;" title="2 Stars">★</span>
                        <span onclick="submitRating(${artefactId}, 3)" style="font-size:20px;" title="3 Stars">★</span>
                        <span onclick="submitRating(${artefactId}, 4)" style="font-size:20px;" title="4 Stars">★</span>
                        <span onclick="submitRating(${artefactId}, 5)" style="font-size:20px;" title="5 Stars">★</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Submits a star rating for an artefact and updates local store.
 * @param {number|string} artefactId - Unique artefact ID.
 * @param {number} stars - Selected rating count (1-5).
 */
function submitRating(artefactId, stars) {
    const data = getArtefactRatingsData(artefactId);
    data.ratings.push(stars);
    localStorage.setItem(getRatingsStorageKey(artefactId), JSON.stringify(data));

    if (typeof showToast === 'function') {
        showToast('Thank you! Rated ' + stars + ' stars!', 'success');
    }
    displayStarRating(artefactId);
}

/**
 * Loads and renders user reviews for an artefact.
 * @param {number|string} artefactId - Unique artefact ID.
 */
function loadArtefactRatings(artefactId) {
    const container = document.getElementById('reviews-' + artefactId);
    if (!container) return;

    const data = getArtefactRatingsData(artefactId);

    let reviewsHtml = '';
    if (data.reviews.length === 0) {
        reviewsHtml = '<p style="color:#aaa; font-size:13px;">No reviews yet. Be the first to review!</p>';
    } else {
        reviewsHtml = data.reviews.map(rev => `
            <div style="padding:10px; background:rgba(0,0,0,0.25); border-radius:8px; margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; color:#bb86fc;">
                    <strong>${rev.user}</strong>
                    <span style="color:#aaa;">${rev.date}</span>
                </div>
                <p style="margin:4px 0 0 0; color:#ddd; font-size:13px;">${rev.comment}</p>
            </div>
        `).join('');
    }

    container.innerHTML = `
        <div style="margin-top:20px;">
            <h4 style="color:#bb86fc; margin-bottom:10px;">Visitor Comments & Reviews</h4>
            <div style="max-height:160px; overflow-y:auto; padding-right:8px;">
                ${reviewsHtml}
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
                <input type="text" id="reviewInput-${artefactId}" placeholder="Write a comment..." style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid #444; background:#111; color:#fff; font-size:13px;">
                <button class="btn" style="padding:8px 14px; font-size:13px;" onclick="submitReview(${artefactId})">Post</button>
            </div>
        </div>
    `;
}

/**
 * Submits a new text review for an artefact.
 * @param {number|string} artefactId - Unique artefact ID.
 */
function submitReview(artefactId) {
    const username = sessionStorage.getItem('name') || sessionStorage.getItem('username') || 'Visitor';

    const input = document.getElementById('reviewInput-' + artefactId);
    const comment = input ? input.value.trim() : '';

    if (!comment) {
        if (typeof showToast === 'function') {
            showToast('Please enter a comment', 'error');
        }
        return;
    }

    const data = getArtefactRatingsData(artefactId);
    data.reviews.unshift({
        user: username,
        rating: 5,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    });

    localStorage.setItem(getRatingsStorageKey(artefactId), JSON.stringify(data));
    if (typeof showToast === 'function') {
        showToast('Comment posted successfully!', 'success');
    }

    loadArtefactRatings(artefactId);
}

// Global window registrations
window.getWishlist = getWishlist;
window.saveWishlist = saveWishlist;
window.isArtefactInWishlist = isArtefactInWishlist;
window.updateWishlistBadges = updateWishlistBadges;
window.addToWishlist = addToWishlist;
window.checkWishlist = checkWishlist;
window.updateWishlistButtonUI = updateWishlistButtonUI;
window.refreshAllWishlistButtons = refreshAllWishlistButtons;
window.displayStarRating = displayStarRating;
window.submitRating = submitRating;
window.loadArtefactRatings = loadArtefactRatings;
window.submitReview = submitReview;

document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadges();
    setTimeout(refreshAllWishlistButtons, 100);
});
window.addEventListener('load', () => {
    updateWishlistBadges();
    refreshAllWishlistButtons();
});
