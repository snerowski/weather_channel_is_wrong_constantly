var searchForm = $("#go");
var cityEl = $("#city-search");
var fiveDayEl = $("#fiveDay");
var pastSearchesArea = $("#pastSearches");
var locationUrl = 'https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=25aec6e1a5f4bd4d4c5e2b4868c2e0e3';
var requestUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=25aec6e1a5f4bd4d4c5e2b4868c2e0e3'
var pastSearchEls = [];

$(searchForm).on("submit", function (event) {
  event.preventDefault();
   console.log(event);
  var location = cityEl.val();
  getLocation(location);
});

$('#pastSearches').click(function () {
  var clicked = event.target.value;
  console.log(clicked);
  getLocation(clicked);
})

function getLocation(location) {
    console.log("getLocation called with location:", location);
    var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=25aec6e1a5f4bd4d4c5e2b4868c2e0e3`;
    fetch(locationUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var coords = {
          lat: data[0].lat,
          lon: data[0].lon,
        };
        cityEl.val("");
        getWeather(coords);
      });
  }
  


function displayPastCities () {
  console.log('hi')
  pastSearchesArea.html('');
  pastSearchEls = JSON.parse(localStorage.getItem("cities"))||[];
  for (let i = 0; i<pastSearchEls.length; i++) {
    var pastSearch = $("<button>");
    pastSearch.addClass("pastsearch");
    pastSearch.addClass("col");
    pastSearch.attr('value', pastSearchEls[i]);
    pastSearch.text(`${pastSearchEls[i]}`);
    pastSearchesArea.append(pastSearch);
  }
}

displayPastCities();

function getWeather(coords) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=25aec6e1a5f4bd4d4c5e2b4868c2e0e3`;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        fiveDayEl.html('');
        $("#cityName").text(`${data.city.name}`);
        $("#cityTemp").text(`${data.list[0].main.temp}`);
        $("#cityWind").text(`${data.list[0].wind.speed}`);
        $("#cityHumidity").text(`${data.list[0].main.humidity}`);
        var weatherIcon = $("<img>");
        weatherIcon.attr('src', `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`);
        $('#cityName').append(weatherIcon);
        var pastSearchEls = pastSearchesArea.children();
  
        pastSearchEls = JSON.parse(localStorage.getItem("cities"))||[];
        if (!pastSearchEls.includes(data.city.name)) {
          pastSearchEls.push(data.city.name);
          localStorage.setItem('cities', JSON.stringify(pastSearchEls))
          displayPastCities(pastSearchEls);
        }
        for (var i = 0; i < pastSearchEls.length; i++) {
          if (i<pastSearchEls.length-1 && pastSearchEls[i] !== data.city.name) {
            continue
          } else if (i<pastSearchEls.length && pastSearchEls[i] == data.city.name) {
            break
          } else {
            var pastSearch = $("<p>");
            pastSearch.addClass("pastsearch");
            pastSearch.text(`${data.city.name}`);
            pastSearchesArea.append(pastSearch);
          }
        }
  
        for (var i = 7; i < 40; i += 8) {
          var newCard = $("<div>");
          newCard.addClass("col");
          var dayInfo = data.list[i];
          var date = data.list[i].dt;
          newCard.html(`
              <h3>${dayjs.unix(dayInfo.dt).format("M/D")}</h3>
              <img src='http://openweathermap.org/img/wn/${dayInfo.weather[0].icon}.png'/>
              <p>Temp: ${dayInfo.main.temp}°F</p>
              <p>Wind: ${dayInfo.wind.speed} mph</p>
              <p>Humidity: ${dayInfo.main.humidity}%</p>
              `);
          fiveDayEl.append(newCard);
        }
        displayPastCities();
      });
  }
  