document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(form);
      const city = formData.get("city");
      document.querySelector(".searchResult").style.display = "block";

      const cityData = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
      );
      const cityDataJson = await cityData.json();
      const country = cityDataJson.results[0].country;
      const timezone = cityDataJson.results[0].timezone;
      const population = cityDataJson.results[0].population;
      const cityName = cityDataJson.results[0].admin1;

      document.querySelector(".country").textContent = country;
      document.querySelector(".timezone").textContent = timezone;
      document.querySelector(".population").textContent = population;
      document.querySelector(".cityName").textContent = cityName;

      const latitude = cityDataJson.results[0].latitude;
      const longitude = cityDataJson.results[0].longitude;
      const weatherDataByCountry = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
      );
      const weatherDataJsonByCountry = await weatherDataByCountry.json();
      const currentTemperature =
        weatherDataJsonByCountry.current.temperature_2m;
      document.querySelector(
        ".currentTemperature"
      ).textContent = `${currentTemperature}°C`;

      const maxTemperature =
        weatherDataJsonByCountry.daily.temperature_2m_max[0];
      const minTemperature =
        weatherDataJsonByCountry.daily.temperature_2m_min[0];
      document.querySelector(
        ".temperatureRange"
      ).innerHTML = `${minTemperature}°C<br />${maxTemperature}°C`;
      const isDay = weatherDataJsonByCountry.current.is_day;
      if (isDay === 1) {
        document.querySelector(".cityNameAndTemperature").style[
          "background-image"
        ] = "url('images/day.jpg')";
      } else {
        document.querySelector(".cityNameAndTemperature").style[
          "background-image"
        ] = "url('images/night.jpg')";
      }
      form.reset();
    } catch (error) {
      console.error(error);
    }
  });
});
