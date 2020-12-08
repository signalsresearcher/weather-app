let celsiusTemperature = null;
let form = document.querySelector("#citySelect");
form.addEventListener("submit", submitSearch);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let searchForm = document.querySelector("#citySelect");
searchForm.addEventListener("submit", submitSearch);


function showTemperature(response) {
  console.log('showTemperature()');

  celsiusTemperature = response.data.main.temp;
  let iconElement = document.querySelector("#starry");
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#place").innerHTML = response.data.name;
   let windElement = document.querySelector("#wind");
  windElement.innerHTML = `Wind: ${response.data.wind.speed}m/sec`;
  let humidElement = document.querySelector("#humidity");
  humidElement.innerHTML = `Humidity: ${response.data.main.humidity} %`;
  let weatherDescription = document.querySelector("#desc");
  weatherDescription.innerHTML = response.data.weather[0].description;
  document.querySelector("#tempo").innerHTML = Math.round(
    response.data.main.temp
  );
}



function searchCity(city) {
  console.log("searchCity():", city);

  if (city == "" || typeof city == "undefined") {
    Swal.fire({
      title: '<strong>Error</strong>',
      icon: 'error',
      html: 'Please indicate the City',
    });
    document.querySelector('#preloadBox').style.display = "none";
    document.querySelector('#dateBox').style.display = "block";
  } else {
    let apiKey = "b15a7ca92a2c2ec9099ff7e3223bfa9b";
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    axios.get(apiUrl).then(function (response) {
      console.log(response);
      showTemperature(response);

      apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&excluse={minutely,alerts}&units=${units}&appid=${apiKey}`;

      axios.get(apiUrl).then(function(response) {

        let dateElement = document.querySelector("#date");
        var timezone = response.data.timezone;
        dateElement.innerHTML = getEditedTime(response.data.current.dt, timezone, true);

        displayForecast(response);

      }).catch(function (error) {
        console.log(error);
      });

    }).catch(function (error) {
      let msg = JSON.parse(error.request.response);

      Swal.fire({
        title: '<strong>Error</strong>',
        icon: 'error',
        html: msg.message,
      });
      document.querySelector('#preloadBox').style.display = "none";
      document.querySelector('#dateBox').style.display = "block";
    });

  }
}

searchCity('Quito, Ecuador');


function submitSearch(event) {
  event.preventDefault();
  let city = document.querySelector("#inputCity").value;

  document.querySelector('#dateBox').style.display = "none";
  document.querySelector('#preloadBox').style.display = "block";

  searchCity(city);
}

function displayFahrenheitTemperature(event) {
  console.log('displayFahrenheitTemperature()');
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemperature = degreesCelsiusToFahrenheit(celsiusTemperature);
  let temperatureElement = document.querySelector("#tempo");

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  hideTempI();
  var tempFahArr = document.querySelectorAll('.card-body .fah');
  for (let i = 0; i < tempFahArr.length; i++) {
    tempFahArr[i].style.display = "inline";
  }

}


function degreesCelsiusToFahrenheit(val) {
  return Math.round((val * 9) / 5 + 32);
}

function displayCelsiusTemperature(event) {
  console.log('displayCelsiusTemperature()');


  if (typeof event != "undefined") {
    event.preventDefault();
  }

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let temperatureElement = document.querySelector("#tempo");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  
  hideTempI();
  var tempCelArr = document.querySelectorAll('.card-body .cel');
  for (let i = 0; i < tempCelArr.length; i++) {
    tempCelArr[i].style.display = "inline";
  }

}

function hideTempI() {
  var tempIArr = document.querySelectorAll('.card-body i');
  for (let i = 0; i < tempIArr.length; i++) {
    tempIArr[i].style.display = "none";
  }
}



function displayForecast(response) {
  console.log('displayForecast()');
  console.log(response);


  let forecast = null;


  for (let index = 0; index < 5; index++) {
    forecast = response.data.daily[index];
    console.log('forecast:', forecast);

    let forecastElement = document.querySelector(".card.n" + (index + 1));
    var date = getEditedTime(forecast.dt, response.data.timezone, false);
  

    forecastElement.innerHTML = `
      <h5 class="card-header">
        ${date}
      </h5>
      <img class="card-img-top" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
      <div class="card-body">
        <p class="card-text">
          <span class="forecastHi">
            <i class="cel">${Math.round(forecast.temp.max)}</i>
            <i class="fah" style="display:none;">${degreesCelsiusToFahrenheit(forecast.temp.max)}</i>
            &deg;
          </span>
          |
          <span class="forecastLo">
            <i class="cel">${Math.round(forecast.temp.min)}</i>
            <i class="fah" style="display:none;">${degreesCelsiusToFahrenheit(forecast.temp.min)}</i>
            &deg;
          </span>
        </p>
      </div>
  `;
  }



  document.querySelector('#dateBox').style.display = "block";
  document.querySelector('#preloadBox').style.display = "none";
  displayCelsiusTemperature();

}


function getEditedTime(UNIX_timestamp, timezone, showTime) {
  let a = moment.unix(UNIX_timestamp).tz(timezone);
  let output = "";
  if(showTime) {
    output = `
    <span>${a.format('ddd')}</span>
    <small> ${a.format('DD-MMM-YYYY HH:MM')} </small>
  `;
  } else {
    output = `
    <span>${a.format('ddd')}</span>
    <small> ${a.format('DD-MMM-YYYY')} </small>
  `;
  }

  return output;
}





