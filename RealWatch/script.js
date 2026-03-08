// Data Model & State
let items = JSON.parse(localStorage.getItem('realwatch_items')) || [];
let currentFilter = 'all';
let searchQuery = '';
let isWatchedOpen = false;

// DOM Elements
const titleInput = document.getElementById('titleInput');
const typeSelect = document.getElementById('typeSelect');
const noteInput = document.getElementById('noteInput');
const addBtn = document.getElementById('addBtn');
const watchlist = document.getElementById('watchlist');
const watchedList = document.getElementById('watchedList');
const watchedCount = document.getElementById('watchedCount');
const watchedHeader = document.getElementById('watchedHeader');
const toggleIcon = document.getElementById('toggleIcon');
const searchInput = document.getElementById('searchInput');
const filterChips = document.getElementById('filterChips');

// Initialize
function init() {
    render();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addItem);
    
    titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        render();
    });

    filterChips.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            render();
        }
    });

    watchedHeader.addEventListener('click', () => {
        isWatchedOpen = !isWatchedOpen;
        watchedList.classList.toggle('open', isWatchedOpen);
        toggleIcon.textContent = isWatchedOpen ? '▲' : '▼';
    });
}

// Actions
function addItem() {
    const title = titleInput.value.trim();
    if (!title) return;

    const newItem = {
        id: Date.now(),
        title: title,
        type: typeSelect.value,
        note: noteInput.value.trim(),
        addedAt: new Date().toISOString(),
        watched: false
    };

    items.unshift(newItem);
    save();
    
    // Reset inputs
    titleInput.value = '';
    noteInput.value = '';
    render();
}

function toggleWatched(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        item.watched = !item.watched;
        save();
        render();
    }
}

function deleteItem(id, confirmDelete = true) {
    if (!confirmDelete || confirm('Are you sure you want to delete this item?')) {
        items = items.filter(i => i.id !== id);
        save();
        render();
    }
}

function editItem(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        // Prefill form
        titleInput.value = item.title;
        typeSelect.value = item.type;
        noteInput.value = item.note || '';
        
        // Delete original item (no confirmation)
        deleteItem(id, false);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Focus title input
        titleInput.focus();
    }
}

function save() {
    localStorage.setItem('realwatch_items', JSON.stringify(items));
}

// Rendering
function render() {
    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery);
        const matchesFilter = currentFilter === 'all' ||
                            (currentFilter === 'unwatched' && !item.watched) ||
                            (currentFilter === 'watched' && item.watched) ||
                            item.type === currentFilter;
        return matchesSearch && matchesFilter;
    });

    const unwatchedItems = filteredItems.filter(i => !i.watched);
    const watchedItems = filteredItems.filter(i => i.watched);

    // Update counts
    watchedCount.textContent = items.filter(i => i.watched).length;

    // Render Unwatched
    if (unwatchedItems.length === 0) {
        watchlist.innerHTML = `<div class="empty-state">No items found. Add something to your list!</div>`;
    } else {
        watchlist.innerHTML = unwatchedItems.map(item => createItemCard(item)).join('');
    }

    // Render Watched
    watchedList.innerHTML = watchedItems.map(item => createItemCard(item)).join('');
}

function createItemCard(item) {
    const date = new Date(item.addedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return `
        <div class="item-card ${item.watched ? 'watched' : ''}" data-id="${item.id}">
            <div class="item-info">
                <div class="item-header">
                    <span class="item-title">${item.title}</span>
                    <span class="badge">${item.type}</span>
                </div>
                ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
                <div class="item-date">Added on ${date}</div>
            </div>
            <div class="item-actions">
                <button class="action-btn edit-btn" onclick="editItem(${item.id})" title="Edit item">
                    ✏️
                </button>
                <button class="action-btn watch-btn" onclick="toggleWatched(${item.id})" title="${item.watched ? 'Mark as unwatched' : 'Mark as watched'}">
                    ${item.watched ? '↩️' : '✅'}
                </button>
                <button class="action-btn delete-btn" onclick="deleteItem(${item.id})" title="Delete item">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

init();
