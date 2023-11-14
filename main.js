$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
  fetchForecast(search);

});

var addWeather = function (data) {
  weather = {
    city: data.name || null,
    temperature: data.main.temp,
    condition: data.weather[0].main,
    graphic: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png' 
  };

  for(propertyName in weather) {
    if(typeof weather[propertyName] === 'number') {
      weather[propertyName] = weather[propertyName].toFixed(0);
    }
  };

  renderWeather();

}

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=5680c370851e451caebb07d26dd81f83&units=imperial",
    dataType: "json",
  });
};

var renderWeather = function () {
  $('.current-weather').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather);

  $('.current-weather').append(newHTML);
};

var week = [];

var fetchForecast = function (query) {
  $.ajax({
    method:"GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=5680c370851e451caebb07d26dd81f83&units=imperial",
    dataType: "json",
  });
};

var addForecast = function (data) {

  week = [];
  
  for (var i =0; i < data.list.length; i++) {
    var forecastData = data.list[i];

    var forecast = {
      condition: forecastData.weather[0].main,
      temperature: forecastData.main.temp,
      graphic: 'http://openweathermap.org/img/wn/' + forecastData.weather[0].icon + '@2x.png',
      time: forecastData.dt_txt,
      date: null
    };
    if (forecast.time.includes('12:00:00')) {
      const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const day = new Date(forecast.time);

      forecast.date = weekday[day.getDay()];

      week.push(forecast);

      forecast.temperature = forecast.temperature.toFixed(0);
    };
  }
  renderForecast();
  
};

var renderForecast = function () {
  $('.forecasts').empty();

  for (var i = 0; i < week.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(week[i]);

  $('.forecasts').append(newHTML);
  };
};
  