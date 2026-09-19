/**
 * Render the multi-criteria advanced filters form into the container.
 */
function showAdvancedFilters() {
    const filterContainer = document.getElementById('advanced-filters-container');
    if (!filterContainer) return;

    const html = `
        <div class="advanced-filters">
            <h3 style="color:#bb86fc; margin-top:0;">Advanced Filters</h3>
            <div class="filter-group">
                <div class="filter-item">
                    <label>Filter by Dynasty</label>
                    <select id="filter-dynasty" onchange="applyFilters()">
                        <option value="">All Dynasties</option>
                        <option value="Maurya">Maurya</option>
                        <option value="Gupta">Gupta</option>
                        <option value="Mughal">Mughal</option>
                        <option value="Rajput">Rajput</option>
                    </select>
                </div>
                <div class="filter-item">
                    <label>Filter by Material</label>
                    <select id="filter-material" onchange="applyFilters()">
                        <option value="">All Materials</option>
                        <option value="Stone">Stone</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Terracotta">Terracotta</option>
                        <option value="Gold">Gold</option>
                    </select>
                </div>
                <div class="filter-item">
                    <label>Filter by Deity</label>
                    <select id="filter-deity" onchange="applyFilters()">
                        <option value="">All Deities</option>
                        <option value="Krishna">Krishna</option>
                        <option value="Vishnu">Vishnu</option>
                        <option value="Shiva">Shiva</option>
                        <option value="Brahma">Brahma</option>
                    </select>
                </div>
                <div class="filter-item">
                    <label>Filter by Floor</label>
                    <select id="filter-floor" onchange="applyFilters()">
                        <option value="">All Floors</option>
                        <option value="1">Floor 1</option>
                        <option value="2">Floor 2</option>
                        <option value="3">Floor 3</option>
                    </select>
                </div>
            </div>
            <button class="btn" style="width:100%; padding:12px;" onclick="resetFilters()">Reset Filters</button>
        </div>
    `;
    filterContainer.innerHTML = html;
}

/**
 * Filter the artefacts list by dynasty, material, deity, and floor criteria.
 */
function applyFilters() {
    const dynasty = document.getElementById('filter-dynasty')?.value || '';
    const material = document.getElementById('filter-material')?.value || '';
    const deity = document.getElementById('filter-deity')?.value || '';
    const floor = document.getElementById('filter-floor')?.value || '';

    fetch('/api/artefacts')
    .then(res => res.json())
    .then(data => {
        let filtered = data;

        if (dynasty) filtered = filtered.filter(a => a.dynasty && a.dynasty.toLowerCase().includes(dynasty.toLowerCase()));
        if (material) filtered = filtered.filter(a => a.material && a.material.toLowerCase().includes(material.toLowerCase()));
        if (deity) filtered = filtered.filter(a => a.deity && a.deity.toLowerCase().includes(deity.toLowerCase()));
        if (floor) filtered = filtered.filter(a => a.floor == floor);
        
        display(filtered);
    })
    .catch(err => console.log('Error applying filters'));
}

/**
 * Reset all filter dropdowns to their default states and refresh artefacts.
 */
function resetFilters() {
    document.getElementById('filter-dynasty').value = '';
    document.getElementById('filter-material').value = '';
    document.getElementById('filter-deity').value = '';
    document.getElementById('filter-floor').value = '';
    
    applyFilters();
    showToast('Filters reset successfully', 'success');
}

/**
 * Initialize filters when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('advanced-filters-container')) {
        showAdvancedFilters();
    }
});
