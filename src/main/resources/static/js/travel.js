let allData = [];

/**
 * Loads default floor data when page loads.
 */
window.onload = function () {
    loadFloor(1);
};

/**
 * Loads artefacts and description corresponding to the selected museum floor.
 * @param {number} floor - Floor number (1, 2, or 3).
 */
function loadFloor(floor) {
    const info = document.getElementById("floor-info");

    if (floor == 1) {
        info.innerHTML = "<h2>Floor 1 - Sculptures</h2><p>Ancient sculptures of Krishna, Vishnu, and deities.</p>";
    } else if (floor == 2) {
        info.innerHTML = "<h2>Floor 2 - Paintings & Manuscripts</h2><p>Mahabharata paintings and sacred texts.</p>";
    } else {
        info.innerHTML = "<h2>Floor 3 - Coins & Ritual Objects</h2><p>Ancient coins and temple objects.</p>";
    }

    fetch("/api/artefacts/floor/" + floor)
        .then(res => res.json())
        .then(data => {
            allData = data;
            display(data);
        })
        .catch(() => {
            const container = document.getElementById("travel-container");
            if (container) {
                container.innerHTML = "<h2>Failed to load artefacts</h2>";
            }
        });
}

/**
 * Renders artefact cards for the current floor view.
 * @param {Array<Object>} data - Array of floor artefact objects.
 */
function display(data) {
    const container = document.getElementById("travel-container");
    if (!container) return;
    container.innerHTML = "";

    data.forEach((a, index) => {
        container.innerHTML += `
            <div class="artefact-card" style="animation-delay: ${index * 0.05}s;">
                <button class="wishlist-btn" data-wishlist-id="${a.artefactId}" onclick="event.stopPropagation(); addToWishlist(${a.artefactId})">🤍</button>
                <img class="card-image" src="${a.imageUrl}" alt="${a.name}" onclick="openModal(${a.artefactId})">
                <div class="card-info" onclick="openModal(${a.artefactId})">
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

    if (typeof checkWishlist === "function") {
        data.forEach(a => checkWishlist(a.artefactId));
    }
}

/**
 * Opens artefact details in modal dialog by ID.
 * @param {number} id - Artefact ID.
 */
function openModal(id) {
    const a = allData.find(x => x.artefactId === id);
    if (!a) return;

    document.getElementById("detailImage").src = a.imageUrl;
    document.getElementById("detailCode").innerText = a.code || "";
    document.getElementById("detailName").innerText = a.name;
    document.getElementById("detailType").innerText = a.type;
    document.getElementById("detailMaterial").innerText = a.material;
    document.getElementById("detailDynasty").innerText = a.dynasty;
    document.getElementById("detailRegion").innerText = a.region;
    document.getElementById("detailDeity").innerText = a.deity;
    document.getElementById("detailMuseum").innerText = a.museum;
    document.getElementById("detailDesc").innerText = a.description;

    document.getElementById("artefactModal").classList.add("open");
}

/**
 * Handles backdrop click to close modal.
 * @param {MouseEvent} e - Click event.
 */
function closeModal(e) {
    if (e.target.id === "artefactModal") {
        closeModalDirect();
    }
}

/**
 * Closes modal directly.
 */
function closeModalDirect() {
    const modal = document.getElementById("artefactModal");
    if (modal) {
        modal.classList.remove("open");
    }
}