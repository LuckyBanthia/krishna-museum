let allData = [];

/**
 * Fetch artefacts catalog from backend API on page load.
 */
window.onload = function () {
  fetch("/api/artefacts")
    .then(res => res.json())
    .then(data => {
      allData = data;
      display(data);
    })
    .catch(() => {
      document.getElementById("artefacts-container").innerHTML = "<h2>Failed to load artefacts</h2>";
    });
};

/**
 * Render artefact cards into the main catalog container.
 *
 * @param {Array} data List of artefact objects
 */
function display(data) {
  const container = document.getElementById("artefacts-container");
  container.innerHTML = "";

  data.forEach((a, index) => {
    container.innerHTML += `
      <div class="artefact-card" style="animation-delay: ${index * 0.05}s;">
        <button class="wishlist-btn" data-wishlist-id="${a.artefactId}" onclick="event.stopPropagation(); addToWishlist(${a.artefactId})">🤍</button>
        <img class="card-image" src="${a.imageUrl}" alt="${a.name}" onclick="openModal(${a.artefactId})">
        <div class="card-info" onclick="openModal(${a.artefactId})">
          <div>
            <h3 class="card-name">${a.name}</h3>
            <div class="card-meta">${a.type}</div>
          </div>
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
 * Filter artefacts by primary category type.
 *
 * @param {string} type Artefact category name
 */
function filterType(type) {
  if (!Array.isArray(allData) || allData.length === 0) return;

  let filtered = allData;

  if (type && type !== 'All') {
    filtered = allData.filter(a => a.type === type);
  }

  display(filtered);

  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(button => {
    const expected = button.textContent.trim();
    let buttonType = expected;
    if (expected === 'Ritual') {
      buttonType = 'Ritual Object';
    }
    if (expected === 'All') {
      buttonType = 'All';
    }

    button.classList.toggle('active', buttonType === type);
  });
}

/**
 * Open the detailed modal overlay for a selected artefact.
 *
 * @param {number} id Artefact identifier
 */
function openModal(id) {
  const a = allData.find(x => x.artefactId === id);
  if (!a) return;

  trackVisitedArtefact(id);

  document.getElementById("detailImage").src = a.imageUrl;
  document.getElementById("detailCode").textContent = a.code || "";
  document.getElementById("detailName").textContent = a.name;
  document.getElementById("detailType").textContent = a.type;
  document.getElementById("detailMaterial").textContent = a.material;
  document.getElementById("detailDynasty").textContent = a.dynasty;
  document.getElementById("detailRegion").textContent = a.region;
  document.getElementById("detailDeity").textContent = a.deity;
  document.getElementById("detailMuseum").textContent = a.museum;
  document.getElementById("detailDesc").textContent = a.description;

  document.getElementById("artefactModal").classList.add("open");
}

/**
 * Close modal if backdrop area was clicked.
 *
 * @param {Event} e Click event
 */
function closeModal(e) {
  if (e.target.id === "artefactModal") closeModalDirect();
}

/**
 * Close modal directly by removing open class.
 */
function closeModalDirect() {
  document.getElementById("artefactModal").classList.remove("open");
}

/**
 * Record visited artefact id in user history in local storage.
 *
 * @param {number} artefactId Artefact identifier
 */
function trackVisitedArtefact(artefactId) {
  const username = sessionStorage.getItem('username');
  if (!username) return;

  const key = `visitedArtefacts_${encodeURIComponent(username)}`;
  let visited = localStorage.getItem(key);
  if (!visited) {
    visited = [];
  } else {
    try {
      visited = JSON.parse(visited);
      if (!Array.isArray(visited)) visited = [];
    } catch {
      visited = [];
    }
  }

  if (!visited.includes(artefactId)) {
    visited.push(artefactId);
    localStorage.setItem(key, JSON.stringify(visited));
  }
}