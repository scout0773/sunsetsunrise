document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchBtn").addEventListener("click", function () {
    fetchCoordinatesAndData();
  });

  document.getElementById("geolocationBtn").addEventListener("click", function () {
    fetchCurrentLocationAndData();
});
});

function fetchCurrentLocationAndData() {
    if ("geolocation" in navigator) {
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = '<p>Loading...</p>';

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                fetchData(latitude, longitude, "Current Location");
            },
            error => {
                console.error('Geolocation Error:', error);

                resultContainer.innerHTML = `<p>Error: Unable to fetch coordinates for current location</p>`;
            }
        );
    } else {
        resultContainer.innerHTML = `<p>Error: Geolocation is not supported in your browser.</p>`
    }
}

function fetchCoordinatesAndData() {
  const addressInput = document.getElementById("locationSearch");
  const address = addressInput.value.trim();

  if (!address) {
    alert("Please enter a location");
    return;
  }

  addressInput.value = "";

  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "<p>Loading...</p>";

  const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
    address
  )}`;

  fetch(geocodeApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Geocoding API Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((geoData) => {
      console.log("Geocoding Response:", geoData);

      if (geoData.length > 0) {
        const { display_name, lat, lon } = geoData[0];

        fetchData(lat, lon, display_name);
      } else {
        resultContainer.innerHTML = `<p>Error: Unable to fetch coordinates for the provided address</p>`;
      }
    })
    .catch((error) => {
      console.error("Geocoding API Error:", error);

      resultContainer.innerHTML = `<p>Error: Unable to fetch coordinates for the provided address</p>`;
    });
}

function fetchData(latitude, longitude, display_name) {
  const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;

  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "<p>Loading...</p>"; // Placeholder content

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Sunrise Sunset API Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Sunrise Sunset API Response:", data);

      const {
        sunrise,
        sunset,
        first_light,
        last_light,
        dawn,
        dusk,
        solar_noon,
        golden_hour,
        day_length,
        timezone,
      } = data.results;


      resultContainer.innerHTML = `
                <h3>${display_name}</h3>
                <h4>Today:</h4>
                <p>Sunrise: ${moment(sunrise, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Sunset: ${moment(sunset, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>First Light: ${moment(first_light, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Last Light: ${moment(first_light, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Dawn: ${moment(dawn, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Dusk: ${moment(dusk, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Solar Noon: ${moment(solar_noon, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Golden Hour: ${moment(golden_hour, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Day Length: ${moment(day_length, "hh:mm:ss A").format("h:mm:ss A")}</p>
                <p>Timezone: ${timezone}</p>
            `;
    })
    .catch((error) => {
      console.error("Sunrise Sunset API Error:", error);

      resultContainer.innerHTML = `<p>Error: Unable to fetch sunrise sunset data</p>`;
    });
}