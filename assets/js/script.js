$("document").ready(function () {
   let apiKey = "38068f8dbeb00ea35c18384c9fb8712c";
   let queryURL;
   let searchInput = $("#city-search");
   let submitBtn = $("#submit");
   let citySearch;
   let cityName;
   let iconURL;
   let iconCode;
   
   //ajax call for current weather
   function getWeather() {
      $.ajax({
         url: `https://api.openweathermap.org/data/2.5/weather?id=4138106&units=imperial&APPID=${apiKey}`,
         method: "GET",
         data: {
            appid: apiKey
         }
      }).then(function (response) {
         console.log(response);
         $("#city-name").text(`${response.name}`);
         console.log(response.weather[0].icon);
         $("#weather-icon").attr("src", `https://openweathermap.org/img/wn/` + response.weather[0].icon + `@2x.png`);
         $("#temp").text(`Temperature: ${response.main.temp}°F`);
         // $("#date").text(response.dt_txt.split(" ")[0]);
         $("#humidity").text(`Humidity: ${response.main.humidity}%`);
         $("#windspeed").text(`Wind: ${response.wind.speed} mph`);
         let cityLat = response.coord.lat;
         let cityLon = response.coord.lon;
         let uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLon}`;
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
      });
   };

   getWeather();
   
   function citylist() {
      queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName},us&units=imperial&APPID=${apiKey}`;
      $.ajax({
         url: queryURL,
         method: "GET",
         data: {
            q: cityName
         }
      }).then(function (response) {
         $("#city-name").text(`${response.name}`);
         $("#weather-icon").attr("src", `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
         $("#temp").text(`Temperature: ${response.main.temp}°F`);
         $("#humidity").text(`Humidity: ${response.main.humidity}%`);
         $("#windspeed").text(`Wind: ${response.wind.speed} mph`);
         let cityLat = response.coord.lat;
         let cityLon = response.coord.lon;
         uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLon}`;
         $.ajax({
            url: uvURL,
            method: "GET"
         }).then(function (response) {
            $("#uvindex").text(`UV Index: ${response.value}`);
         });
      });
   };

   function cityWeather () {
      let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
      savedCities.push(citySearch);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      displaySavedCities(savedCities);
      
      queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${citySearch},us&units=imperial&APPID=${apiKey}`;
      $.ajax({
         url: queryURL,
         method: "GET",
         data: {
            q: citySearch
         }
      }).then(function (response) {
         console.log(response);
         $("#city-name").text(`${response.name}`);
         $("#weather-icon").attr("src", `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
         $("#temp").text(`Temperature: ${response.main.temp}°F`);
         $("#humidity").text(`Humidity: ${response.main.humidity}%`);
         $("#windspeed").text(`Wind: ${response.wind.speed} mph`);
         let cityLat = response.coord.lat;
         let cityLon = response.coord.lon;
         uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLon}`;
         $.ajax({
            url: uvURL,
            method: "GET"
         }).then(function (response) {
            $("#uvindex").text(`UV Index: ${response.value}`);
         });
      });
   }


   function getFiveDay() {
      forecastMinTemp = [];
      forecastMaxTemp = [];
      queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&units=imperial&APPID=${apiKey}`;
      $.ajax({
         url: queryURL,
         method: "GET",
         data: {
            q: cityName
         }
      }).then(function(response) {
         $.each(response.list, function(idx, val) {
            forecastMaxTemp.push(val.main.temp_max);
            forecastMinTemp.push(val.main.temp_min);
            day1();
            day2();
            day3();
            day4();
            day5();
         });
      });
   };

   submitBtn.on("click", function (e) {
      e.preventDefault();
      cityName = searchInput.val();
      citySearch = searchInput.val();
      cityWeather();
      $("#city-search").val("");
      $("#fiveday").removeClass("hide");
      getFiveDay();
   });

   function displaySavedCities(savedData) {
      console.log(savedData);
      let cityBtn = $("<button>");
      for (i=0; i<savedData.length; i++) {
         cityBtn.text(savedData[i]);
         $("#cities-list").append(cityBtn);
         cityBtn.addClass(".searchbtn"); 
      };
      
      cityBtn.on("click", function(e){
         e.preventDefault();
         console.log("click");
         cityName = $(this).text();
         citySearch = $(this).text();
         // console.log(cityName);
         cityWeather();
         citylist();
         getFiveDay();
      });
   };

   function day1 () {
      let date = moment()
         .add(1, "days")
         .format("MMMM Do");
      $("#date1").text(date);
      $("#max-temp1").text("High Temp: " + forecastMaxTemp[0]);
      $("#min-temp1").text("Low Temp: " + forecastMinTemp[0]);
   }

   function day2 () {
      let date = moment()
         .add(2, "days")
         .format("MMMM Do");
      $("#date2").text(date);
      $("#max-temp2").text("High Temp: " + forecastMaxTemp[1]);
      $("#min-temp2").text("Low Temp: " + forecastMinTemp[1]);
   }

   function day3 () {
      let date = moment()
         .add(3, "days")
         .format("MMMM Do");
      $("#date3").text(date);
      $("#max-temp3").text("High Temp: " + forecastMaxTemp[2]);
      $("#min-temp3").text("Low Temp: " + forecastMinTemp[2]);
   }

   function day4 () {
      let date = moment()
         .add(4, "days")
         .format("MMMM Do");
      $("#date4").text(date);
      $("#max-temp4").text("High Temp: " + forecastMaxTemp[3]);
      $("#min-temp4").text("Low Temp: " + forecastMinTemp[3]);
   }

   function day5 () {
      let date = moment()
         .add(5, "days")
         .format("MMMM Do");
      $("#date5").text(date);
      $("#max-temp5").text("High Temp: " + forecastMaxTemp[4]);
      $("#min-temp5").text("Low Temp: " + forecastMinTemp[4]);
   }

});