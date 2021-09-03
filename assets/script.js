var apikey = '0fea28f84458b942cf54dbeb98d2fda5';
var userInput = $('#userInput').val();
var submitBtn = $('#submitBtn');
var btnSecondary = $('.btnSecondary');
var recentSearch = $('#recentSearch');
var day = $('#day');
var dayCity = $('#dayCity');
var dayCurrent = $('#dayCurrent');
var dayIcon = $('#dayIcon');
var dayTemp = $('#dayTemp');
var dayWind = $('#dayWind');
var dayHumidity = $('#dayHumidity');
var dayUV = $('#dayUV');
var fiveDayWeather = $('.fiveDayWeather');
var fiveDayDate = $('.fiveDayDate');
var fiveDayTemp = $('.fiveDayTemp');
var fiveDayPhoto = $('.fiveDayPhoto');
var fiveDayWind = $('.fiveDayWind');
var fiveDayHumidity = $('.fiveDayHumidity');
var saveCity = [];


function getAPI() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${apikey}`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data);
            dayCity.text(data.name);
            dayCurrent.text(moment().format('dddd, MMM do'));

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&units=imperial&appid=${apikey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data2) {
                    console.log(data2.current.uvi)
                    dayUV.text(`UV Index: ${data2.current.uvi}`);
                    if (data2.current.uvi > 4) {
                        dayUV.css('background', '#F3C5A6')
                    } else if (data2.current.uvi > 2) {
                        dayUV.css('background', '#F2DABD')
                    } else {
                        dayUV.css('background', '#DAF1BB')
                    }

                    dayIcon.prepend("<img src=http://openweathermap.org/img/wn/" + data2.current.weather[0].icon + "@2x.png />");
                    dayTemp.text('temp: ' + data2.current.temp + '°F');
                    dayWind.text('wind: ' + data2.current.wind_speed + 'MPH');
                    dayHumidity.text('humidity: ' + data2.current.humidity + '%');

                    fiveDayTemp.each(function(i) { $(this).text("temp: " + data2.daily[i].temp.day) })
                    fiveDayWind.each(function(i) { $(this).text("wind: " + data2.daily[i].wind_speed) })
                    fiveDayHumidity.each(function(i) { $(this).text("humidity: " + data2.daily[i].humidity) })
                    fiveDayDate.each(function(i) { $(this).text(moment().add(1 + i, 'days').format("dddd")); });
                    fiveDayPhoto.each(function(i) { $(this).prepend("<img src=http://openweathermap.org/img/wn/" + data2.daily[i].weather[0].icon + "@2x.png />"); });
                })
        })
}
function check() {
    if (localStorage.getItem("cities") != null) {
        return JSON.parse(localStorage.getItem("cities"))
    } else {
        return saveCity;
    }
}

function save() {
    saveCity = check(); 
    saveCity.unshift(userInput); 

    if (saveCity.length > 5) {
        saveCity.pop(); 
        localStorage.setItem("cities", JSON.stringify(saveCity));
    } else {
        localStorage.setItem("cities", JSON.stringify(saveCity))
    }
}

function display() {
    saveCity = check();
    $.each(saveCity, function(i) {
        var button = $('<button class = "btn btn-secondary w-100">/>');
        button.html(saveCity[i]);
        recentSearch.append(button);
    })
}

function updateDiv() {
    recentSearch.html('');
    dayIcon.html('');
    fiveDayPhoto.html('');
}

submitBtn.click(function() {
    userInput = $('#userInput').val();
    updateDiv()
    getAPI();
    save();
    check();
    display();
})

recentSearch.click(function(event) {
    var eventTarget = $(event.target);
    userInput = eventTarget.text();
    updateDiv()
    getAPI();
    save();
    check();
    display();
})

display();