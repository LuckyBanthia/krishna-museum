let allData = [];

/**
 * Initializes home page data on window load by fetching artefacts.
 */
window.onload = function () {
    fetch("/api/artefacts")
        .then(res => res.json())
        .then(data => {
            allData = data;
            display(data.slice(0, 6));
        });
};

/**
 * Opens artefact detail modal by identifier.
 * @param {number} id - Artefact ID.
 */
function openModal(id) {
    if (typeof showDetail === "function") {
        showDetail(id);
    }
}

/**
 * Renders artefact cards into the home page container.
 * @param {Array<Object>} data - Array of artefact records.
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
                        ${a.dynasty}<br>${a.region}
                    </div>
                </div>
            </div>
        `;
    });

    if (typeof checkWishlist === "function") {
        data.forEach(a => checkWishlist(a.artefactId));
    }
}

/**
 * Opens image zoom modal for a selected home page image.
 * @param {string} imageSrc - Source URL of the image.
 */
function zoomHomepageImage(imageSrc) {
    const modal = document.getElementById('homepageImageModal');
    const image = document.getElementById('homepageImage');
    
    if (modal && image) {
        image.src = imageSrc;
        modal.classList.add('open');
    }
}

/**
 * Closes the home page image zoom modal when backdrop is clicked.
 * @param {MouseEvent} e - Click event.
 */
function closeHomepageImageModal(e) {
    if (e.target.id === "homepageImageModal") {
        const modal = document.getElementById('homepageImageModal');
        if (modal) {
            modal.classList.remove('open');
        }
    }
}

/**
 * Closes the home page image zoom modal directly.
 */
function closeHomepageImageModalDirect() {
    const modal = document.getElementById('homepageImageModal');
    if (modal) {
        modal.classList.remove('open');
    }
}