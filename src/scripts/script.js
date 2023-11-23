document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchBtn").addEventListener("click", function () {
    fetchCoordinatesAndData();
  });
});

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

function fetchData(latitude, longitude, locationName) {
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
                <p>Sunrise: ${sunrise}</p>
                <p>Sunset: ${sunset}</p>
                <p>First Light: ${first_light}</p>
                <p>Last Light: ${last_light}</p>
                <p>Dawn: ${dawn}</p>
                <p>Dusk: ${dusk}</p>
                <p>Solar Noon: ${solar_noon}</p>
                <p>Golden Hour: ${golden_hour}</p>
                <p>Day Length: ${day_length}</p>
                <p>Timezone: ${timezone}</p>
                <!-- Add more data as needed -->
            `;
    })
    .catch((error) => {
      console.error("Sunrise Sunset API Error:", error);

      resultContainer.innerHTML = `<p>Error: Unable to fetch sunrise sunset data</p>`;
    });
}