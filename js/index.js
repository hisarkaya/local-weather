var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var API_KEY = "bc743ea9df1a116348caf0ae822849b3";
var tempKelvin = 0;
var currentTempFlag = 0;

function success(pos) {  
  var weatherUri = "http://api.openweathermap.org/data/2.5/weather";
  var weatherIconUri = "http://openweathermap.org/img/w/";
  
  var coords = pos.coords;
  var query = "?lat=" + coords.latitude + "&lon=" + coords.longitude +"&appid=" + API_KEY;
  
  $.getJSON(weatherUri + query)
    .done(function(data) { 
      tempKelvin = data.main.temp;

      $("#location").text(data.name + ", " +data.sys.country);
      $("#temp").html(convertKelvin(tempKelvin, currentTempFlag));
      $("#main").text(data.weather[0].main);
      $("#icon").prop("src", weatherIconUri + data.weather[0].icon + ".png");    
      $("#icon").prop("alt", data.weather[0].description);       
  })
    .fail(function(jqxhr, textStatus, error) {
      $(".container-fluid").hide();
      $(".alert").show();
      $(".alert").text("Error: " + textStatus + ":" + error);      
  })   
};

function error(err) {
  $(".container-fluid").hide();
  $(".alert").show();
  $(".alert").text("Error: " + err.message);  
};

/*
Converts tempature value in Kelvin to
- if toFlag = 0 then to the Celcius
- else to the Fahrenheit
and returns the rounded calculated value 
with an appropriate sign appended
*/
function convertKelvin(k, toFlag) {
  if (toFlag === 0) 
    return Math.round(k - 273.15) + " &deg;C";
  else 
    return Math.round((k * 1.8) - 459.67) + " &deg;F";;
}

$(document).ready(function() {
  $(".alert").hide();
  $(".container-fluid").show();
  navigator.geolocation.getCurrentPosition(success, error, options);
  
  $("#btnSwitch").on("click", function() {
    if (currentTempFlag === 0) {
      currentTempFlag = 1;
      $("#btnSwitch").html("to &deg;C");
    }      
    else {      
      currentTempFlag = 0;
      $("#btnSwitch").html("to &deg;F");
    }
    $("#temp").html(convertKelvin(tempKelvin, currentTempFlag));      
  });
});