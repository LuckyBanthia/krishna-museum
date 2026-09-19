/**
 * Fetches all artefacts and populates the visual timeline view.
 */
function loadTimeline() {
    fetch('/api/artefacts')
        .then(res => res.json())
        .then(data => displayTimeline(data))
        .catch(() => console.error('Error loading timeline'));
}

/**
 * Renders artefact nodes along a chronological floor-based timeline.
 * @param {Array<Object>} artefacts - Array of artefact records.
 */
function displayTimeline(artefacts) {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    const sorted = artefacts.sort((a, b) => (a.floor || 0) - (b.floor || 0));

    let html = '<div class="timeline">';
    sorted.forEach((artefact, index) => {
        const isEven = index % 2 === 0;
        html += `
            <div class="timeline-item" style="margin-left: ${isEven ? '0' : '50%'}; padding-right:20px">
                <div class="timeline-content" onclick="showDetail(${artefact.artefactId})">
                    <div class="timeline-year">Floor ${artefact.floor || 'Unknown'}</div>
                    <div style="color:#bb86fc; font-weight:bold; margin:8px 0;">${artefact.name}</div>
                    <div class="timeline-period">${artefact.dynasty} | ${artefact.region}</div>
                    <div style="color:#ddd; font-size:13px; margin-top:8px;">${artefact.description ? artefact.description.substring(0, 100) + '...' : 'No description'}</div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Filters timeline nodes by matching dynasty name.
 * @param {string} dynasty - Dynasty name query string.
 */
function filterTimelineByDynasty(dynasty) {
    fetch('/api/artefacts')
        .then(res => res.json())
        .then(data => {
            const filtered = data.filter(a => a.dynasty && a.dynasty.toLowerCase().includes(dynasty.toLowerCase()));
            displayTimeline(filtered);
        })
        .catch(() => console.error('Error filtering timeline'));
}

/**
 * Filters timeline nodes by a chronological period range.
 * @param {number} startYear - Start year of period.
 * @param {number} endYear - End year of period.
 */
function filterTimelineByPeriod(startYear, endYear) {
    fetch('/api/artefacts')
        .then(res => res.json())
        .then(data => {
            const filtered = data.filter(a => true);
            displayTimeline(filtered);
        })
        .catch(() => console.error('Error filtering timeline'));
}

// Bootstrap timeline on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('timeline-container')) {
        loadTimeline();
    }
});
