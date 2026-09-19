/**
 * Verify administrator authorization upon page load.
 */
window.onload = function () {
    let role = sessionStorage.getItem("role");
    if (role !== "ADMIN") {
        alert("Access Denied!");
        window.location.href = "/login";
    }
};

/**
 * Toggle between artefact management and event management tabs.
 *
 * @param {string} tab Active tab name ('artefact' or 'event')
 */
function switchTab(tab) {
    const artefactForm = document.getElementById('artefactForm');
    const eventForm = document.getElementById('eventForm');
    const artefactTab = document.getElementById('artefactTab');
    const eventTab = document.getElementById('eventTab');

    if (tab === 'artefact') {
        artefactForm.style.display = 'block';
        eventForm.style.display = 'none';
        artefactTab.style.background = '#bb86fc';
        eventTab.style.background = 'transparent';
    } else {
        artefactForm.style.display = 'none';
        eventForm.style.display = 'block';
        artefactTab.style.background = 'transparent';
        eventTab.style.background = '#bb86fc';
    }
}

/**
 * Collect form inputs and submit a new artefact to the backend catalog.
 */
function addArtefact() {

    let artefact = {
        code: document.getElementById("code").value,
        name: document.getElementById("name").value,
        type: document.getElementById("type").value,
        material: document.getElementById("material").value,
        dynasty: document.getElementById("dynasty").value,
        region: document.getElementById("region").value,
        deity: document.getElementById("deity").value,
        museum: document.getElementById("museum").value,
        description: document.getElementById("description").value,
        imageUrl: document.getElementById("imageUrl").value,
        floor: document.getElementById("floor").value
    };

    fetch("/api/artefacts/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artefact)
    })
    .then(res => res.text())
    .then(data => {
        if (data === "Unauthorized") {
            alert("Error: Unauthorized! Please ensure you are logged in as Admin.");
            return;
        }
        alert("Artefact Added!");
        // Clear form
        document.getElementById("code").value = '';
        document.getElementById("name").value = '';
        document.getElementById("type").value = '';
        document.getElementById("material").value = '';
        document.getElementById("dynasty").value = '';
        document.getElementById("region").value = '';
        document.getElementById("deity").value = '';
        document.getElementById("museum").value = '';
        document.getElementById("description").value = '';
        document.getElementById("imageUrl").value = '';
        document.getElementById("floor").value = '';
    });
}

/**
 * Collect form inputs and submit a new cultural event to the database.
 */
function addEvent() {

    let event = {
        title: document.getElementById("eventTitle").value,
        description: document.getElementById("eventDescription").value,
        eventDate: document.getElementById("eventDate").value,
        location: document.getElementById("eventLocation").value,
        category: document.getElementById("eventCategory").value,
        imageUrl: document.getElementById("eventImageUrl").value,
        capacity: parseInt(document.getElementById("eventCapacity").value),
        registered: 0
    };

    fetch("/api/events/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Event Added Successfully!");
            // Clear form
            document.getElementById("eventTitle").value = '';
            document.getElementById("eventDescription").value = '';
            document.getElementById("eventDate").value = '';
            document.getElementById("eventLocation").value = '';
            document.getElementById("eventCategory").value = 'Exhibition';
            document.getElementById("eventImageUrl").value = '';
            document.getElementById("eventCapacity").value = '';
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        alert("Error adding event: " + err);
    });
}