const config = {
    countriesUrl: "https://api.countrystatecity.in/v1/countries",
    citiesUrl: "https://api.countrystatecity.in/v1/countries/[ciso]/cities",
    apiKey: "ZU1UcWJvWkdndWN2NXQ5SXlFcTlZMVdiSExiZzZNMm1MeURuRFQ2ZA=="
};

// Fonction pour récupérer les pays et remplir la liste déroulante
async function fetchCountries() {
    try {
        const response = await axios.get(config.countriesUrl, {
            headers: { 'X-CSCAPI-KEY': config.apiKey }
        });
        const countries = response.data;
        const countrySelect = document.getElementById('Country');

        // Effacer les options existantes
        countrySelect.innerHTML = '<option value="" selected>Choisissez un pays</option>';

        // Remplir la liste déroulante avec les options de pays
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.iso2;
            option.textContent = country.name;
            if (country.iso2 === "DZ") {
                option.selected = true; // Définir l'Algérie comme option par défaut
            }
            countrySelect.appendChild(option);
        });

        // Récupérer les villes pour le pays par défaut (Algérie)
        fetchCities('DZ');
    } catch (error) {
        console.error("Erreur lors de la récupération des pays :", error); // Message d'erreur en cas d'échec de la récupération des pays
    }
}

// Fonction pour récupérer les villes en fonction du pays sélectionné et remplir la liste déroulante
async function fetchCities(countryCode) {
    try {
        const url = config.citiesUrl.replace('[ciso]', countryCode);
        const response = await axios.get(url, {
            headers: { 'X-CSCAPI-KEY': config.apiKey }
        });
        const cities = response.data;
        const citySelect = document.getElementById('City');

        // Effacer les options existantes
        citySelect.innerHTML = '<option value="" selected>Choisissez une ville</option>';

        // Remplir la liste déroulante avec les options de villes
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            if (city.name === "Blida") {
                option.selected = true; // Définir Blida comme option par défaut
            }
            citySelect.appendChild(option);
        });

        // Récupérer les heures de prière pour la ville par défaut (Blida)
        fetchPrayerTimes();
    } catch (error) {
        console.error("Erreur lors de la récupération des villes :", error); // Message d'erreur en cas d'échec de la récupération des villes
    }
}

// Fonction pour récupérer les heures de prière en fonction du pays et de la ville sélectionnés
async function fetchPrayerTimes() {
    const country = document.getElementById('Country').value;
    const cityElement = document.getElementById('City');
    const city = cityElement.options[cityElement.selectedIndex].text;

    if (country && city) {
        const params = {
            country: country,
            city: city
        };

        try {
            const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', { params: params });
            const timing = response.data.data.timings;

            document.getElementById("fajr").innerHTML = timing.Fajr;
            document.getElementById("dhuhr").innerHTML = timing.Dhuhr;
            document.getElementById("asr").innerHTML = timing.Asr;
            document.getElementById("maghrib").innerHTML = timing.Maghrib;
            document.getElementById("isha").innerHTML = timing.Isha;

            const date = new Date(response.data.data.date.gregorian.date);
            console.log(date);

            const arabicDate = date.toLocaleDateString('ar-EG', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            document.getElementById("date").innerHTML = arabicDate;
            console.log(arabicDate);

        } catch (error) {
            console.error('Erreur lors de la récupération des heures de prière :', error); // Message d'erreur en cas d'échec de la récupération des heures de prière
        }
    }
}

// Écouteur d'événement pour le changement dans la liste déroulante des pays
document.getElementById('Country').addEventListener('change', (event) => {
    const countryCode = event.target.value;
    if (countryCode) {
        fetchCities(countryCode); // Récupérer les villes en fonction du pays sélectionné
    } else {
        document.getElementById('City').innerHTML = '<option value="" selected>Choisissez une ville</option>';
    }
});

// Écouteur d'événement pour le changement dans la liste déroulante des villes
document.getElementById('City').addEventListener('change', fetchPrayerTimes);

// Initialiser la liste des pays lors du chargement de la page
window.onload = fetchCountries;
