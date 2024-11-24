// Sample data for states and districts in India
const stateDistricts = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Bomdila", "Pasighat"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Tezpur", "Jorhat"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur"],
    "Goa": ["Panaji", "Margao", "Mapusa", "Vasco", "Ponda"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Rohtak"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Kullu", "Mandi"],
    "Jammu & Kashmir": ["Srinagar", "Jammu", "Baramulla", "Anantnag", "Leh"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Senapati", "Ukhrul"],
    "Meghalaya": ["Shillong", "Tura", "Nongpoh", "Jowai", "Williamnagar"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Bikaner"],
    "Sikkim": ["Gangtok", "Gyalshing", "Mangan", "Namchi", "Singtam"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Ambassa"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Almora", "Roorkee"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"]
};


const states = Object.keys(stateDistricts);
const genders = ["Male", "Female", "Other"];

// Function to populate state, district, age group dropdowns
function populateDropdowns() {
    const stateDropdown = document.getElementById('state');
    const ageGroupDropdown = document.getElementById('age-group');

    states.forEach(state => {
        let option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateDropdown.appendChild(option);
    });

    for (let i = 0; i <= 100; i += 4) {
        let option = document.createElement('option');
        option.value = `${i}-${i + 3}`;
        option.textContent = `${i}-${i + 3}`;
        ageGroupDropdown.appendChild(option);
    }

    stateDropdown.addEventListener('change', populateDistricts);
}

function populateDistricts() {
    const districtDropdown = document.getElementById('district');
    districtDropdown.innerHTML = '<option value="">Select District</option>';
    const selectedState = document.getElementById('state').value;

    if (selectedState) {
        stateDistricts[selectedState].forEach(district => {
            let option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtDropdown.appendChild(option);
        });
    }
}

// Function to create and update charts
function createCharts(data) {
    const genderCounts = data.reduce((acc, cur) => {
        acc[cur.gender] = (acc[cur.gender] || 0) + 1;
        return acc;
    }, {});

    const ageCounts = data.reduce((acc, cur) => {
        let ageGroup = `${Math.floor(cur.age / 10) * 10}-${Math.floor(cur.age / 10) * 10 + 9}`;
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        return acc;
    }, {});

    updatePieChart(genderCounts);
    updateBarChart(ageCounts);
}

function updatePieChart(genderCounts) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
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

function updateBarChart(ageCounts) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
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

// Function to filter data based on dropdown selections
function filterData(data) {
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const gender = document.getElementById('gender').value;
    const ageGroup = document.getElementById('age-group').value.split('-').map(Number);

    const filteredData = data.filter(item => {
        return (state === '' || item.state === state) &&
               (district === '' || item.district === district) &&
               (gender === '' || item.gender === gender) &&
               (ageGroup.length !== 2 || (item.age >= ageGroup[0] && item.age <= ageGroup[1]));
    });

    createCharts(filteredData);
}

// Function to load CSV data and initialize charts
function loadCSV() {
    Papa.parse('random_data_1000.csv', {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;

            // Attach event listeners for dropdowns to trigger filtering and chart updates
            document.getElementById('state').addEventListener('change', () => filterData(data));
            document.getElementById('district').addEventListener('change', () => filterData(data));
            document.getElementById('gender').addEventListener('change', () => filterData(data));
            document.getElementById('age-group').addEventListener('change', () => filterData(data));

            filterData(data); // Initial chart on page load
        }
    });
}

// Initialize dropdowns and load CSV data
window.onload = function() {
    populateDropdowns();
    loadCSV();
}
