/*!
 Name: Open Weather
 Dependencies: jQuery, OpenWeatherMap API
 Author: Michael Lynch
 Author URL: http://michaelynch.com
 Date Created: August 28, 2013
 Licensed under the MIT license
 */

;(function($) {

    $.fn.openWeather  = function(options) {

        // return if no element was bound
        // so chained events can continue
        if(!this.length) {
            return this;
        }

        // define default parameter
        var defaults = {
            descriptionTarget: null,
            maxTemperatureTarget: null,
            minTemperatureTarget: null,
            windSpeedTarget: null,
            windDirectionTarget: null,
            humidityTarget: null,
            sunriseTarget: null,
            sunsetTarget: null,
            placeTarget: null,
            iconTarget: null,
            customIcons: null,
            units: 'metric',
            windSpeedUnit: 'Kph',
            windDirectionUnit: 'compass',
            //clickConvertTemperature: true,
            //clickConvertWindDirection: true,
            clickConvertWindSpeed: true,
            city: null,
            lat: null,
            lng: null,
            key: null,
            lang: 'en',
            success: function() {},
            error: function(message) {}
        };

        // define plugin
        var plugin = this;

        // define element
        var el = $(this);

        // api URL
        var apiURL;

        // define settings
        plugin.settings = {};

        // merge defaults and options
        plugin.settings = $.extend({}, defaults, options);

        // define settings namespace
        var s = plugin.settings;

        // define basic api endpoint
        apiURL = '//api.openweathermap.org/data/2.5/weather?lang='+s.lang+'&units='+s.units;

        // if city isn't null
        if(s.city != null) {

            // define API url using city (and remove any spaces in city)
            apiURL += '&q='+s.city.replace(' ', '');

        } else if(s.lat != null && s.lng != null) {

            // define API url using lat and lng
            apiURL += '&lat='+s.lat+'&lon='+s.lng;
        }

        // if api key was supplied
        if(s.key != null) {

            // append api key paramater
            apiURL += '&appid=' + s.key;

        }

        // format time function
        var formatTime = function(unixTimestamp) {

            // define milliseconds using unix time stamp
            var milliseconds = unixTimestamp * 1000;

            // create a new date using milliseconds
            var date = new Date(milliseconds);

            // define hours
            var hours = date.getHours();

            // if hours are greater than 12
            if(hours > 12) {

                // calculate remaining hours in the day
                hoursRemaining = 24 - hours;

                // define hours as the reamining hours subtracted from a 12 hour day
                hours = 12 - hoursRemaining;
            }

            // define minutes
            var minutes = date.getMinutes();

            // convert minutes to a string
            minutes = minutes.toString();

            // if minutes has less than 2 characters
            if(minutes.length < 2) {

                // add a 0 to minutes
                minutes = 0 + minutes;
            }

            // construct time using hours and minutes
            var time = hours + ':' + minutes;

            return time;
        }

        $.ajax({
            type: 'GET',
            url: apiURL,
            dataType: 'jsonp',
            success: function(data) {
                console.log(apiURL);
                var temperature;
                var temperatureUnit;
                var minTemperature;
                var maxTemperature;

                switch(s.units){
                    case 'imperial':
                        //Imperial measurements use Fahrenheit for temperature.
                        temperatureUnit = '°F';
                        break;
                    case 'metric':
                        //Metric measurements use Centigrade/Celsius for temperature.
                        temperatureUnit = '°C';
                        break;
                    case 'standard':
                        //The standard temperature from the API uses Kelvin by default.
                        temperatureUnit = '°K';
                        break;
                    default:
                        temperatureUnit = '°K';

                }

                temperature = Math.round(data.main.temp) + temperatureUnit;
                minTemperature = Math.round(data.main.temp_min) + temperatureUnit;
                maxTemperature = Math.round(data.main.temp_max) + temperatureUnit;

                // set temperature
                el.html(temperature);

                // if minTemperatureTarget isn't null
                if(s.minTemperatureTarget != null) {

                    // set minimum temperature
                    $(s.minTemperatureTarget).text(minTemperature);
                }

                // if maxTemperatureTarget isn't null
                if(s.maxTemperatureTarget != null) {

                    // set maximum temperature
                    $(s.maxTemperatureTarget).text(maxTemperature);
                }

                // set weather description
                $(s.descriptionTarget).text(data.weather[0].description);

                // if iconTarget and default weather icon aren't null
                if(s.iconTarget != null && data.weather[0].icon != null) {

                    // if customIcons isn't null
                    if(s.customIcons != null) {

                        // define the default icon name
                        var defaultIconFileName = data.weather[0].icon;

                        var iconName;

                        var timeOfDay;

                        // if default icon name contains the letter 'd'
                        if(defaultIconFileName.indexOf('d') != -1) {

                            // define time of day as day
                            timeOfDay = 'day';

                        } else {

                            // define time of day as night
                            timeOfDay = 'night';
                        }

                        // if icon is clear sky
                        if(defaultIconFileName == '01d' || defaultIconFileName == '01n') {

                            iconName = 'clear';
                        }

                        // if icon is clouds
                        if(defaultIconFileName == '02d' || defaultIconFileName == '02n' || defaultIconFileName == '03d' || defaultIconFileName == '03n' || defaultIconFileName == '04d' || defaultIconFileName == '04n') {

                            iconName = 'clouds';
                        }

                        // if icon is rain
                        if(defaultIconFileName == '09d' || defaultIconFileName == '09n' || defaultIconFileName == '10d' || defaultIconFileName == '10n') {

                            iconName = 'rain';
                        }

                        // if icon is thunderstorm
                        if(defaultIconFileName == '11d' || defaultIconFileName == '11n') {

                            iconName = 'storm';
                        }

                        // if icon is snow
                        if(defaultIconFileName == '13d' || defaultIconFileName == '13n') {

                            iconName = 'snow';
                        }

                        // if icon is mist
                        if(defaultIconFileName == '50d' || defaultIconFileName == '50n') {

                            iconName = 'mist';
                        }

                        // define custom icon URL
                        var iconURL = s.customIcons+timeOfDay+'/'+iconName+'.png';

                    } else {

                        // define icon URL using default icon
                        var iconURL = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
                    }

                    // set iconTarget src attribute as iconURL
                    $(s.iconTarget).attr('src', iconURL);
                }

                // if placeTarget isn't null
                if(s.placeTarget != null) {

                    // set humidity
                    $(s.placeTarget).text(data.name + ', ' + data.sys.country);
                }

                // if windSpeedTarget isn't null
                if(s.windSpeedTarget != null) {

                    var windSpeed;

                    //Default speed from API is in meters per second (mps).
                    switch(s.windSpeedUnit){
                        case 'mps':
                            windSpeed = (data.wind.speed);
                            break;
                        case 'Mph':
                            windSpeed = (data.wind.speed / 0.44704);
                            break;
                        case 'Kph':
                            //No break termination, as this is the default.
                            windSpeed = (data.wind.speed * 3.6);
                    }


                    // set wind speed
                    $(s.windSpeedTarget).text(windSpeed.toFixed(1) + ' ' + s.windSpeedUnit);

                    if(s.clickConvertWindSpeed == true){

                        var convertWindSpeedClickCount = 0;

                        //Using slice to remove units from value.
                        var currentWindSpeedValue = $(s.windSpeedTarget).text().substring(0, 2);
                        var windSpeedUnits = ['Kph','Mph','mps'];

                        $(s.windSpeedTarget).on('click', function(e){
                            convertWindSpeedClickCount++;
                            var newWindSpeedUnit = windSpeedUnits[convertWindSpeedClickCount % windSpeedUnits.length];
                            var newSpeed;


                            newSpeed = convertWindSpeed(s.windSpeedUnit, newWindSpeedUnit, currentWindSpeedValue);
                            $(s.windSpeedTarget).text(newSpeed);

                        });
                    }
                }

                // if windDirection isn't null
                if(s.windDirectionTarget != null){

                    // set wind direction
                    var windDirection = data.wind.deg;

                    if(s.windDirectionUnit === 'degrees') {
                        $(s.windDirectionTarget).text(windDirection.toFixed(1) + '°');
                    }
                    if(s.windDirectionUnit === 'compass'){

                        // The 16 general compass directions
                        var compassDirections = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

                        // There are 16 general compass directions.
                        // Dividing 360 by 16 equals 22.5.
                        // 0.5 is added to prevent ties.
                        var directionIndex = null;
                        if($.isNumeric(windDirection))
                        {
                            if(windDirection >=0){
                                directionIndex=+Math.round(((windDirection/22.5)+0.5)%16);
                                $(s.windDirectionTarget).text(compassDirections[directionIndex]);
                            }
                        }
                    }
                    else{
                        $(s.windDirectionTarget).text(windDirection.toFixed(1) + '°');
                    }
                }

                // if humidityTarget isn't null
                if(s.humidityTarget != null) {

                    // set humidity
                    $(s.humidityTarget).text(data.main.humidity + '%');
                }

                // if sunriseTarget isn't null
                if(s.sunriseTarget != null) {

                    var sunrise = formatTime(data.sys.sunrise);

                    // set humidity
                    $(s.sunriseTarget).text(sunrise + ' AM');
                }

                // if sunriseTarget isn't null
                if(s.sunsetTarget != null) {

                    var sunset = formatTime(data.sys.sunset);

                    // set humidity
                    $(s.sunsetTarget).text(sunset + ' PM');
                }

                // run success callback
                s.success.call(this);
            },

            error: function(jqXHR, textStatus, errorThrown) {

                // run error callback
                s.error.call(this, textStatus);
            }
        });



        function convertWindSpeed(unitFrom, unitTo, value) {

            if(value == null){
                return null;
            }
            else {
                var windSpeed;

                if (unitFrom === 'Kph' && unitTo === 'Mph') {
                    windSpeed = (value / 1.609344);
                }
                else if (unitFrom === 'Mph' && unitTo === 'Kph') {
                    windSpeed = (value * 1.609344);
                }
                else if (unitFrom === 'Kph' && unitTo === 'mps') {
                    windSpeed = (value / 3.6);
                }
                else if (unitFrom === 'Mph' && unitTo === 'mps') {
                    windSpeed = (value * 0.44704);
                }
                else if (unitFrom === 'mps' && unitTo === 'Kph') {
                    windSpeed = (value * 3.6);
                }
                else if (unitFrom === 'mps' && unitTo === 'Mph') {
                    windSpeed = (value * 2.23693629);
                }
                else {
                    return value + ' ' + unitFrom;
                }

                return windSpeed.toFixed(1)  + ' ' + unitTo;
            }
        }
    }


})(jQuery);
