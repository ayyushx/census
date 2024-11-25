// State and District Data
const stateDistricts = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Bomdila", "Pasighat"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Tezpur", "Jorhat"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"]
};

let pieChart, barChart;

// Populate Dropdowns
function populateDropdowns() {
    const stateDropdown = document.getElementById('state');
    const ageGroupDropdown = document.getElementById('age-group');

    // Populate states
    for (const state of Object.keys(stateDistricts)) {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateDropdown.appendChild(option);
    }

    // Populate age groups (increments of 4)
    for (let i = 0; i <= 100; i += 4) {
        const option = document.createElement('option');
        option.value = `${i}-${i + 3}`;
        option.textContent = `${i}-${i + 3}`;
        ageGroupDropdown.appendChild(option);
    }

    stateDropdown.addEventListener('change', populateDistricts);
}

// Populate District Dropdown
function populateDistricts() {
    const stateDropdown = document.getElementById('state');
    const districtDropdown = document.getElementById('district');
    districtDropdown.innerHTML = '<option value="ALL">ALL DISTRICTS</option>';

    const selectedState = stateDropdown.value;
    if (selectedState !== 'ALL') {
        for (const district of stateDistricts[selectedState]) {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtDropdown.appendChild(option);
        }
    }
}

// Update Pie Chart
function updatePieChart(genderCounts) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(genderCounts),
            datasets: [{
                data: Object.values(genderCounts),
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
            }]
        }
    });
}

// Update Bar Chart
function updateBarChart(ageCounts) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ageCounts),
            datasets: [{
                label: 'Age Group Distribution',
                data: Object.values(ageCounts),
                backgroundColor: '#4BC0C0'
            }]
        }
    });
}

// Filter and Create Charts
function filterData(data) {
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const gender = document.getElementById('gender').value;
    const ageGroup = document.getElementById('age-group').value.split('-').map(Number);

    const filteredData = data.filter(item => {
        return (state === 'ALL' || item.state === state) &&
            (district === 'ALL' || item.district === district) &&
            (gender === 'ALL' || item.gender === gender) &&
            (ageGroup.length !== 2 || (item.age >= ageGroup[0] && item.age <= ageGroup[1]));
    });

    const genderCounts = filteredData.reduce((acc, cur) => {
        acc[cur.gender] = (acc[cur.gender] || 0) + 1;
        return acc;
    }, {});

    const ageCounts = filteredData.reduce((acc, cur) => {
        const group = `${Math.floor(cur.age / 10) * 10}-${Math.floor(cur.age / 10) * 10 + 9}`;
        acc[group] = (acc[group] || 0) + 1;
        return acc;
    }, {});

    updatePieChart(genderCounts);
    updateBarChart(ageCounts);
}

// Load CSV and Initialize
function loadCSV() {
    Papa.parse('random_data_1000.csv', {
        download: true,
        header: true,
        complete: function (results) {
            const data = results.data;
            document.getElementById('state').addEventListener('change', () => filterData(data));
            document.getElementById('district').addEventListener('change', () => filterData(data));
            document.getElementById('gender').addEventListener('change', () => filterData(data));
            document.getElementById('age-group').addEventListener('change', () => filterData(data));
            filterData(data);
        }
    });
}

window.onload = function () {
    populateDropdowns();
    loadCSV();
};
