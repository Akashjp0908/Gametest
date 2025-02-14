// Simulated admin credentials (replace with secure authentication in a real app)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

// Elements
const loginPage = document.getElementById('login-page');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const adminDashboard = document.getElementById('admin-dashboard');
const locationTable = document.getElementById('location-table').getElementsByTagName('tbody')[0];
const mapDiv = document.getElementById('map');
const exportCsvButton = document.getElementById('export-csv');
const exportJsonButton = document.getElementById('export-json');
const dateFromInput = document.getElementById('date-from');
const dateToInput = document.getElementById('date-to');
const userIdFilterInput = document.getElementById('user-id-filter');
const filterButton = document.getElementById('filter-button');
const resetFilterButton = document.getElementById('reset-filter-button');
const addLocationButton = document.getElementById('add-location-button');
const addLocationModal = document.getElementById('add-location-modal');
const addLocationForm = document.getElementById('add-location-form');
const closeButton = document.querySelector('.close-button');
const paginationContainer = document.getElementById('pagination');

let map; // Leaflet map instance
let markers = []; // Store markers for easy removal/management
let currentPage = 1;
const itemsPerPage = 10;

// Mock location data (replace with data from your quiz game)
let locationData = [
    { userId: 'user1', latitude: 48.8566, longitude: 2.3522, timestamp: '2023-11-15T10:00:00Z' },
    { userId: 'user2', latitude: 34.0522, longitude: -118.2437, timestamp: '2023-11-15T12:00:00Z' },
    { userId: 'user1', latitude: 51.5074, longitude: -0.1278, timestamp: '2023-11-16T09:30:00Z' },
    { userId: 'user3', latitude: 40.7128, longitude: -74.0060, timestamp: '2023-11-17T15:45:00Z' }
];

// Load data from localStorage if available
if (localStorage.getItem('locationData')) {
    locationData = JSON.parse(localStorage.getItem('locationData'));
}

// --- Authentication ---
function checkLogin() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        loginPage.style.display = 'none';
        adminDashboard.style.display = 'block';
        initAdminDashboard();
    } else {
        loginPage.style.display = 'block';
        adminDashboard.style.display = 'none';
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminToken', 'validToken'); // Simulate a token
        checkLogin();
    } else {
        loginError.textContent = 'Invalid username or password.';
    }
});

// --- Dashboard Initialization ---
function initAdminDashboard() {
    initMap();
    displayLocationData(locationData);
    setupEventListeners();
}

// --- Map Initialization ---
function initMap() {
    map = L.map(mapDiv).setView([0, 0], 2); // Default view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    updateMapMarkers(locationData);
}

function updateMapMarkers(data) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    data.forEach(item => {
        const marker = L.marker([item.latitude, item.longitude]).addTo(map);
        marker.bindPopup(`<b>User ID:</b> ${item.userId}<br><b>Timestamp:</b> ${item.timestamp}`);
        markers.push(marker);
    });

    // Adjust map bounds to fit all markers
    if (markers.length > 0) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds());
    }
}

// --- Data Display ---
function displayLocationData(data) {
    locationTable.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    paginatedData.forEach(item => {
        const row = locationTable.insertRow();
        row.insertCell(0).textContent = item.userId;
        row.insertCell(1).textContent = item.latitude;
        row.insertCell(2).textContent = item.longitude;
        row.insertCell(3).textContent = item.timestamp;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteLocation(item));

        const actionCell = row.insertCell(4);
        actionCell.appendChild(deleteButton);
    });

    displayPagination(data.length);
}

// --- Pagination ---
function displayPagination(totalItems){
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  paginationContainer.innerHTML = '';

  for(let i = 1; i <= totalPages; i++){
    const pageButton = document.createElement('button');
    pageButton.innerText = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      const filteredData = filterData(locationData);
      displayLocationData(filteredData);
    });
    paginationContainer.appendChild(pageButton);
  }
}

// --- Event Listeners ---
function setupEventListeners() {
    exportCsvButton.addEventListener('click', exportToCSV);
    exportJsonButton.addEventListener('click', exportToJSON);
    filterButton.addEventListener('click', applyFilters);
    resetFilterButton.addEventListener('click', resetFilters);
    addLocationButton.addEventListener('click', () => {
      addLocationModal.style.display = 'block';
    });
    closeButton.addEventListener('click', () => {
      addLocationModal.style.display = 'none';
    });
    addLocationForm.addEventListener('submit', addLocation);
}

// --- Data Filtering ---
function applyFilters() {
    const filteredData = filterData(locationData);
    displayLocationData(filteredData);
    updateMapMarkers(filteredData);
}

function filterData(data){
  const fromDate = dateFromInput.value ? new Date(dateFromInput.value + "T00:00:00Z") : null;
    const toDate = dateToInput.value ? new Date(dateToInput.value + "T23:59:59Z") : null;
    const userId = userIdFilterInput.value.trim();

    return data.filter(item => {
        const itemDate = new Date(item.timestamp);
        if (fromDate && itemDate < fromDate) return false;
        if (toDate && itemDate > toDate) return false;
        if (userId && item.userId !== userId) return false;
        return true;
    });
}

function resetFilters() {
    dateFromInput.value = '';
    dateToInput.value = '';
    userIdFilterInput.value = '';
    displayLocationData(locationData);
    updateMapMarkers(locationData);
}

// --- Data Manipulation ---
function deleteLocation(itemToDelete) {
    locationData = locationData.filter(item => !(item.userId === itemToDelete.userId && item.timestamp === itemToDelete.timestamp));
    localStorage.setItem('locationData', JSON.stringify(locationData)); // Update localStorage
    const filteredData = filterData(locationData);
    displayLocationData(filteredData);
    updateMapMarkers(filteredData);
}

function addLocation(event){
  event.preventDefault();

  const userId = document.getElementById('new-user-id').value;
  const latitude = parseFloat(document.getElementById('new-latitude').value);
  const longitude = parseFloat(document.getElementById('new-longitude').value);
  const timestamp = new Date().toISOString();

  locationData.push({userId, latitude, longitude, timestamp});
  localStorage.setItem('locationData', JSON.stringify(locationData));
  const filteredData = filterData(locationData);
  displayLocationData(filteredData);
  updateMapMarkers(filteredData);

  addLocationModal.style.display = 'none';
  addLocationForm.reset();
}

// --- Export Functions ---
function exportToCSV() {
    const csvContent = "data:text/csv;charset=utf-8,"
        + "User ID,Latitude,Longitude,Timestamp\n"
        + locationData.map(item => `${item.userId},${item.latitude},${item.longitude},${item.timestamp}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "location_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToJSON() {
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(locationData));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", "location_data.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initial check on page load
checkLogin();
