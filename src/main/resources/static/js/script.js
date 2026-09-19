/**
 * Fallback toast notification implementation.
 * @param {string} message - Text to show in toast.
 * @param {string} [type='info'] - Style category ('info', 'error', 'success').
 */
if (typeof window.showToast !== "function") {
    window.showToast = function(message, type) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.padding = "12px 16px";
        toast.style.borderRadius = "10px";
        toast.style.zIndex = "9999";
        toast.style.fontWeight = "600";
        toast.style.background = type === "error" ? "#c62828" : "#2e7d32";
        toast.style.color = "#fff";
        toast.style.boxShadow = "0 10px 24px rgba(0,0,0,0.3)";

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    };
}

/**
 * Updates navbar authentication state, role-dependent links, and user greetings.
 */
function updateNavbar() {
    const role = sessionStorage.getItem("role");
    const name = sessionStorage.getItem("name") || sessionStorage.getItem("username");

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeText = document.getElementById("welcomeText");
    const adminBtn = document.getElementById("adminBtn");
    const dashboardBtn = document.getElementById("dashboardBtn");

    if (role) {
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (dashboardBtn) dashboardBtn.style.display = "inline-block";

        if (welcomeText && name) {
            welcomeText.innerText = "Welcome, " + name;
        }

        if (adminBtn) {
            adminBtn.style.display = (role === "ADMIN") ? "inline-block" : "none";
        }
    } else {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (registerBtn) registerBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (dashboardBtn) dashboardBtn.style.display = "none";
        if (welcomeText) welcomeText.innerText = "";
        if (adminBtn) adminBtn.style.display = "none";
    }
}

// Initial bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", function() {
    updateNavbar();

    const container = document.getElementById("artefacts-container");
    if (container) {
        fetch("/api/artefacts")
            .then(res => res.json())
            .then(data => display(data.slice(0, 6)))
            .catch(() => {
                container.innerHTML = "<h2>Failed to load data</h2>";
            });
    }
});

window.addEventListener("load", updateNavbar);

/**
 * Renders artefact cards into the container.
 * @param {Array<Object>} data - Array of artefact objects.
 */
function display(data) {
    const container = document.getElementById("artefacts-container");
    if (!container) return;

    container.innerHTML = "";

    data.forEach((a, index) => {
        container.innerHTML += `
            <div class="artefact-card" style="animation-delay: ${index * 0.1}s;">
                <button class="wishlist-btn" data-wishlist-id="${a.artefactId}" onclick="event.stopPropagation(); addToWishlist(${a.artefactId})">🤍</button>
                <img class="card-image" src="${a.imageUrl}" alt="${a.name}" onclick="showDetail(${a.artefactId})">
                
                <div class="card-info" onclick="showDetail(${a.artefactId})">
                    <h3>${a.name}</h3>
                    <p>${a.type}</p>

                    <div class="card-bottom">
                        ${a.dynasty}<br>
                        ${a.region}
                    </div>
                </div>
            </div>
        `;
    });

    data.forEach(a => {
        checkWishlist(a.artefactId);
    });
}

/**
 * Performs search query against artefacts API and updates UI.
 */
function search() {
    const keyword = document.getElementById("searchInput").value;

    fetch("/api/artefacts/search?keyword=" + encodeURIComponent(keyword))
        .then(res => res.json())
        .then(data => display(data))
        .catch(() => {
            showToast("Search failed", "error");
        });
}

/**
 * Fetches detail for a given artefact ID and displays in modal.
 * @param {number|string} id - Unique artefact ID.
 */
function showDetail(id) {
    fetch(`/api/artefacts/${id}`)
        .then(res => res.json())
        .then(artefact => {
            displayDetail(artefact);
        })
        .catch(() => showToast('Error loading details', 'error'));
}

/**
 * Renders artefact modal view with metadata and ratings.
 * @param {Object} artefact - Artefact data entity.
 */
function displayDetail(artefact) {
    const modal = document.getElementById("artefactModal");
    if (!modal) return;
    
    const html = `
        <div class="detail-modal">
            <button class="modal-close" onclick="closeModalDirect()">✕</button>
            <button class="wishlist-btn" style="position:absolute; top:70px; right:20px;" data-wishlist-id="${artefact.artefactId}" onclick="addToWishlist(${artefact.artefactId})">🤍</button>
            
            <div class="detail-layout">
                <div class="detail-left">
                    <img id="detailImage" src="${artefact.imageUrl}" alt="${artefact.name}">
                </div>

                <div class="detail-right">
                    <div id="detailCode" class="detail-code">${artefact.code || ''}</div>
                    <h2 id="detailName">${artefact.name}</h2>
                    <p id="detailType" style="color:#bb86fc; font-size:16px;">${artefact.type}</p>

                    <div class="detail-grid">
                        <div><strong>Material:</strong> <span id="detailMaterial">${artefact.material}</span></div>
                        <div><strong>Dynasty:</strong> <span id="detailDynasty">${artefact.dynasty}</span></div>
                        <div><strong>Region:</strong> <span id="detailRegion">${artefact.region}</span></div>
                        <div><strong>Deity:</strong> <span id="detailDeity">${artefact.deity}</span></div>
                        <div><strong>Museum:</strong> <span id="detailMuseum">${artefact.museum}</span></div>
                        <div><strong>Floor:</strong> <span id="detailFloor">${artefact.floor}</span></div>
                    </div>

                    <p id="detailDesc" style="color:#ddd; line-height:1.6; margin-top:20px;">${artefact.description}</p>
                    
                    <div id="ratings-${artefact.artefactId}"></div>
                    <div id="reviews-${artefact.artefactId}"></div>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    modal.classList.add('open');
    
    displayStarRating(artefact.artefactId);
    loadArtefactRatings(artefact.artefactId);
    checkWishlist(artefact.artefactId);
}

/**
 * Closes modal when user clicks backdrop.
 * @param {MouseEvent} event - Click event.
 */
function closeModal(event) {
    if (event.target.id === "artefactModal") {
        document.getElementById("artefactModal").classList.remove('open');
    }
}

/**
 * Closes artefact modal directly.
 */
function closeModalDirect() {
    const modal = document.getElementById("artefactModal");
    if (modal) {
        modal.classList.remove('open');
    }
}

/**
 * Logs out the active user and clears session storage.
 */
function logout() {
    sessionStorage.clear();
    window.location.href = "/";
}