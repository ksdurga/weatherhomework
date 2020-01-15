$("document").ready(function () {
   let apiKey = "38068f8dbeb00ea35c18384c9fb8712c";
   let queryURL = `http://api.openweathermap.org/data/2.5/forecast?id=4138106&units=imperial&APPID=${apiKey}`;
   let searchInput = $("#city-search");
   let submitBtn = $("#submit");
   // let cityBtn = $("button.button");
   
   //ajax call for current weather
   function getWeather() {
      $.ajax({
         url: queryURL,
         method: "GET",
         data: {
         q: "Washington DC",
         appid: apiKey
         }
      }).then(function (response) {
         //Setting text/attr to the AJAX response specific object/array index
         $("#city-name").text(`${response.city.name}`);
         $("#weather-icon").attr("src", `http://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`);
         $("#temp").text(`Temperature: ${response.list[0].main.temp}°F`);
         $("#date").text(response.list[0].dt_txt.split(" ")[0]);
         $("#humidity").text(`Humidity: ${response.list[0].main.humidity}%`);
         $("#windspeed").text(`Wind: ${response.list[0].wind.speed} mph`);
         //using the coordinates of the response city to determine URL for UV index
         let cityLat = response.city.coord.lat;
         let cityLon = response.city.coord.lon;
         let uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLon}`;
         //nested AJAX to use first response to get coordinates of that specific city
         $.ajax({
            url: uvURL,
            method: "GET",
            data: {
               appid: apiKey,
               lat: cityLat,
               lon: cityLon
            }
         }).then(function (response) {
            $("p#uvindex").text(`UV Index: ${response.value}`);
         });
         // //for loop to dynamically create div contens for 5 day forecast, set the i to 1 and multiplying by 8 since the objects returned from the response are 3 hour increments (3*8=24) so essentially going to the next day. Only 39 objects so subtracting one at the end so it doesn't get mad
         // for (let i = 1; i < 6; i++) {
         // //setting the sauce for image tag of that specific day's icon using the response chain
         // $(`span#${i}`).find($("img.icon")).attr("src", `http://openweathermap.org/img/wn/${response.list[8 * i - 1].weather[0].icon}@2x.png`);
         // //splitting this node(?) to separate date and time, and then just printing out date (index 0 of the split array)
         // $(`span#${i}`).find($("h3.date")).text(`${response.list[8 * i - 1].dt_txt.split(" ")[0]}`)
         // $(`span#${i}`).find($("p.temp")).text(`Temp: ${response.list[8 * i - 1].main.temp}°F`);
         // $(`span#${i}`).find($("p.humidity")).text(`Humidity: ${response.list[8 * i - 1].main.humidity}%`);
         // }
      });
   };

   getWeather();
 
   submitBtn.on("click", function (e) {
      e.preventDefault();
      let citySearch = searchInput.val();
      citiesArr = [];
      let savedCities = JSON.parse(localStorage.getItem("savedCities"))
      savedCities.push(citySearch);
      citiesArr.push(savedCities);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      
      $.each(savedCities, function(idx, city){
         var cityBtn = $("<button>");
         cityBtn.addClass("hit-api");
         cityBtn.text(citySearch);
         $("#cities-list").append(cityBtn[idx]);
      });
      
      
      queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${citySearch},us&units=imperial&APPID=${apiKey}`;
      $.ajax({
         url: queryURL,
         method: "GET"
      }).then(function (response) {
         $("#city-name").text(`${response.city.name}`);
         $("#weather-icon").attr("src", `http://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`);
         $("#temp").text(`Temperature: ${response.list[0].main.temp}°F`);
         $("#humidity").text(`Humidity: ${response.list[0].main.humidity}%`);
         $("#windspeed").text(`Wind: ${response.list[0].wind.speed} mph`);
         let cityLat = response.city.coord.lat;
         let cityLon = response.city.coord.lon;
         uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLon}`;
         $.ajax({
            url: uvURL,
            method: "GET"
         }).then(function (response) {
            $("#uvindex").text(`UV Index: ${response.value}`);
         });
         for (let i = 1; i < 6; i++) {
            $(`span#${i}`).find($("weather-icon")).attr("src", `http://openweathermap.org/img/wn/${response.list[8 * i - 1].weather[0].icon}@2x.png`);
            $(`span#${i}`).find($("temp")).text(`Temp: ${response.list[8 * i - 1].main.temp}°F`);
            $(`span#${i}`).find($("humidity")).text(`Humidity: ${response.list[8 * i - 1].main.humidity}%`);
         };
      });
   });


   cityBtn.on("click", "document.hit-api", function (e) {
      e.preventDefault();
      
      fiveDayForecast();
   });
});



