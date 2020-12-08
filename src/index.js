//## Initialize variables ##
let celsiusTemperature = null;
let form = document.querySelector("#citySelect");
form.addEventListener("submit", submitSearch);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let searchForm = document.querySelector("#citySelect");
searchForm.addEventListener("submit", submitSearch);

// let dateElement = document.querySelector("#date");
// let currentTime = new Date();
// dateElement.innerHTML = formatDate(currentTime);

// function formatDate(timestamp) {
//   let date = new Date(timestamp);
//   let days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday"
//   ];
//   var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   let day = days[date.getDay()];
//   return `${day} ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${formatHours(timestamp)}`;
// }

// function formatHours(timestamp) {
//   let date = new Date(timestamp);
//   let hours = date.getHours();
//   if (hours < 10) {
//     hours = `0${hours}`;
//   }
//   let minutes = date.getMinutes();
//   if (minutes < 10) {
//     minutes = `0${minutes}`;
//   }
//   return `${hours}:${minutes}`;
// }

function showTemperature(response) {
  console.log('showTemperature()');

  celsiusTemperature = response.data.main.temp;
  let iconElement = document.querySelector("#starry");
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#place").innerHTML = response.data.name;
  document.querySelector("#tempo").innerHTML = Math.round(
    response.data.main.temp
  );
}

function searchCity(city) {
  console.log("searchCity():", city);

  //## Check if city is blank or undefined and show error message ##
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

    // axios.get(apiUrl).then(showTemperature);
    axios.get(apiUrl).then(function (response) {
      console.log(response);
      showTemperature(response);

      // apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
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

      //## Added error check is city is not found ##
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
//## Call searchCity() on load to get values ##
searchCity('Quito, Equador');



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

  //let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let fahrenheitTemperature = degreesCelsiusToFahrenheit(celsiusTemperature);
  let temperatureElement = document.querySelector("#tempo");

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  //## Get all i temp elem and display necessary ones ##
  hideTempI();
  var tempFahArr = document.querySelectorAll('.card-body .fah');
  for (let i = 0; i < tempFahArr.length; i++) {
    tempFahArr[i].style.display = "inline";
  }

}

// ## Added degrees celsius to fahrenheit reusable function ##
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

  //## Get all i temp elem and display necessary ones ##
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

  // ## Moved forecastElement inside the loop ##
  //let forecastElement = document.querySelector(".card.text-center");
  // forecastElement.innerHTML = null;
  let forecast = null;

  // ## Adjusted the for loop, see below ##
  /*   
  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="card-header">
      <h5>
        ${formatHours(forecast.dt * 1000)}
      </h5>
      <img
        src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"
      />
      <div class="p.card-text">
        <strong>
          ${Math.round(forecast.main.temp_max)}°
        </strong>
        ${Math.round(forecast.main.temp_min)}°
      </div>
    </div>
  `;
  }
  */

  for (let index = 0; index < 5; index++) {
    forecast = response.data.daily[index];
    console.log('forecast:', forecast);

    //Get card element based on loop index + 1 (e.g. n1, n2, n3..)
    let forecastElement = document.querySelector(".card.n" + (index + 1));
    var date = getEditedTime(forecast.dt, response.data.timezone, false);
    // console.log(date);

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

  /* 
  Notes:
  Don't use ° for degree symbol, use &deg; html symbol instead. This will ensure that the symbol will display correctly on any device.
  */

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





