/*!
 Name: Open Weather
 Dependencies: jQuery, OpenWeatherMap API
 Author: Michael Lynch
 Contributor: Robert Attfield
 Author URL: http://michaelynch.com
 Contributor URL: https://www.robertattfield.com
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
            shortDescriptionTarget: null,
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
            customBackgroundImages: null,
            units: 'metric',
            windSpeedUnit: 'Kph',
            windDirectionUnit: 'compass',
            clickConvertTemperature: true,
            clickConvertWindDirection: true,
            clickConvertWindSpeed: true,
            city: null,
            lat: null,
            lng: null,
            key: null,
            lang: 'en',
            timeLastUpdatedTarget: null,
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

        // Defining temperature target elements as a group.
        var temperatureTargetElements = ['.' + el.attr('class'), s.minTemperatureTarget, s.maxTemperatureTarget];

        //Creating parameters object tobe passed to AJAX below.
        var parameters = {};

        // if units isn't null
        if(s.units != null){
            parameters.units = s.units;
        }

        // if city isn't null
        if(s.city != null) {
            parameters.q = s.city.replace(' ', '');

        } else if(s.lat != null && s.lng != null) {
            paramaters.lat = s.lat;
            paramaters.lng = s.lng;
        }

        // if api key was supplied
        if(s.key != null) {

            parameters.appid = s.key;

        }

        // format time function
        var formatAMPM = function(unixTimestamp) {
            // define milliseconds using unix time stamp
            var milliseconds = unixTimestamp * 1000;

            // create a new date using milliseconds
            var date = new Date(milliseconds);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        };

        $.ajax({
            url: 'https://proxy.hackeryou.com',
            dataType: 'json',
            method:'GET',
            data: {
                reqUrl: 'http://api.openweathermap.org/data/2.5/weather',
                params: parameters,
                xmlToJSON: false
            },
            success: function(data) {

                var temperature;
                var minTemperature;
                var maxTemperature;

                var dayOrNight = function(){

                    var currentDate = new Date(data.dt*1000);
                    var sunriseDate = new Date(data.sys.sunrise*1000);
                    var sunsetDate = new Date(data.sys.sunset*1000);

                    // If date data last updated between sunrise and sunset,
                    // return day, else return night.
                    if(currentDate > sunriseDate && currentDate < sunsetDate){
                        return 'day';
                    }
                    else{
                        return 'night';
                    }
                };

                temperature = Math.round(data.main.temp) + temperatureUnit(s.units);
                minTemperature = Math.round(data.main.temp_min) + temperatureUnit(s.units);
                maxTemperature = Math.round(data.main.temp_max) + temperatureUnit(s.units);

                // set temperature
                el.html(temperature);

                if(s.clickConvertTemperature == true){

                    var convertTemperatureClickCount = 0;

                    var temperatureMeasurements = ['metric', 'imperial', 'standard'];

                    // Get numerical temperature value - substring to remove temperature units.
                    // el is the element target where the temperature is displayed.
                    var currentTemperature = $(el).text().substring(0, $(el).text().length - 2);
                    maxTemperature = parseFloat(maxTemperature.substring(0, maxTemperature.length - 2));
                    minTemperature = parseFloat(minTemperature.substring(0, minTemperature.length - 2));

                    //Iterate over all element targets displaying temperature, enabling all of their temperature
                    //values to change when either one is clicked.
                    for(var i = 0; i < temperatureTargetElements.length; i++){
                        $(temperatureTargetElements[i]).on('click', function(){
                            var newTemperatureUnit = temperatureMeasurements[convertTemperatureClickCount % temperatureMeasurements.length];
                            var newTemperature = convertTemperature(s.units, newTemperatureUnit, currentTemperature);

                            var newMaxTemperature = convertTemperature(s.units, newTemperatureUnit, maxTemperature);
                            var newMinTemperature = convertTemperature(s.units, newTemperatureUnit, minTemperature);

                            if(el != null){
                                $(el).text(newTemperature);
                            }

                            if(s.minTemperatureTarget != null){
                                $(s.minTemperatureTarget).text(newMinTemperature);
                            }
                            if(s.maxTemperatureTarget != null){
                                $(s.maxTemperatureTarget).text(newMaxTemperature);
                            }
                            convertTemperatureClickCount++;

                        });
                    }
                }

                // if minTemperatureTarget isn't null
                if(s.minTemperatureTarget != null) {

                    // set minimum temperature
                    $(s.minTemperatureTarget).text(minTemperature + temperatureUnit(s.units));
                }

                // if maxTemperatureTarget isn't null
                if(s.maxTemperatureTarget != null) {

                    // set maximum temperature
                    $(s.maxTemperatureTarget).text(maxTemperature + temperatureUnit(s.units));
                }

                // set short weather description
                if(s.shortDescriptionTarget != null) {
                    $(s.shortDescriptionTarget).text(data.weather[0].main);
                }

                // set long weather description
                if(s.descriptionTarget != null) {
                    $(s.descriptionTarget).text(data.weather[0].description);
                }

                // if iconTarget and default weather icon aren't null
                if(s.iconTarget != null && data.weather[0].icon != null) {

                    // if customIcons isn't null
                    if(s.customIcons != null) {

                        // define the default icon name
                        var defaultIconFileName = data.weather[0].icon;

                        var timeOfDay = dayOrNight();

                        // define custom icon URL
                        var iconURL = s.customIcons+timeOfDay+'/'+weatherIconName(defaultIconFileName)+'.png';

                    } else {

                        // define icon URL using default icon
                        var iconURL = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
                    }

                    // set iconTarget src attribute as iconURL
                    $(s.iconTarget).attr('src', iconURL);
                }

                if(s.customBackgroundImages != null && data.weather[0].main != null){

                    // define the default icon name
                    var defaultBackgroundFileName = data.weather[0].icon;

                    var backgroundImageName;

                    timeOfDay = dayOrNight();

                    backgroundImageName = s.customBackgroundImages + timeOfDay + '/' + weatherIconName(defaultBackgroundFileName) + '.jpg';

                    $('html').css('height', '100%');
                    $('body').css({
                        'height': '100%',
                        'background-image': 'url(' + backgroundImageName + ')',
                        'background-repeat': 'no-repeat',
                        '-webkit-background-size': 'cover',
                        '-moz-background-size': 'cover',
                        '-o-background-size': 'cover',
                        'background-size': 'cover',
                        'background-position': 'center'
                    });

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
                    $(s.windSpeedTarget).text(parseFloat(windSpeed.toFixed(1)) + ' ' + s.windSpeedUnit);

                    if(s.clickConvertWindSpeed == true){

                        var convertWindSpeedClickCount = 0;

                        //Using substring to remove units from value.
                        var currentWindSpeedValue = parseFloat($(s.windSpeedTarget).text().substring(0, 4));
                        var windSpeedUnits = ['Kph','Mph','mps'];

                        $(s.windSpeedTarget).on('click', function(e){
                            convertWindSpeedClickCount++;
                            var newWindSpeedUnit = windSpeedUnits[convertWindSpeedClickCount % windSpeedUnits.length];
                            var newSpeed = convertWindSpeed(s.windSpeedUnit, newWindSpeedUnit, currentWindSpeedValue);
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
                        // There are 16 general compass directions.
                        // Dividing 360 by 16 equals 22.5.
                        // 0.5 is added to prevent ties.
                        if($.isNumeric(windDirection))
                        {
                            if(windDirection >=0){
                                var compass = convertDegreesToCompass(windDirection);
                                $(s.windDirectionTarget).text(compass);
                            }
                        }
                    }
                    else{
                        $(s.windDirectionTarget).text(windDirection.toFixed(1) + '°');
                    }

                    // Convert wind direction (degrees/compass) if enabled.
                    if(s.clickConvertWindDirection == true){
                        var convertWindDirectionClickCount = 0;
                        var windDirectionUnits = ['degrees', 'compass'];

                        $(s.windDirectionTarget).on('click', function(){
                            convertWindDirectionClickCount++;
                            var newWindDirectionUnit = windDirectionUnits[convertWindDirectionClickCount % windDirectionUnits.length];

                            // If default unit is 'degrees', convert measurement to 'compass'.
                            if(newWindDirectionUnit === 'degrees'){
                                var compass = convertDegreesToCompass(windDirection);
                                $(s.windDirectionTarget).text(compass);
                            }
                            else if(newWindDirectionUnit ==='compass'){
                                $(s.windDirectionTarget).text(windDirection.toFixed(1) + '°');
                            }
                        });
                    }
                }

                // if humidityTarget isn't null
                if(s.humidityTarget != null) {

                    // set humidity
                    $(s.humidityTarget).text(data.main.humidity + '%');
                }

                // if sunriseTarget isn't null
                if(s.sunriseTarget != null) {

                    var sunrise = formatAMPM(data.sys.sunrise);

                    // set humidity
                    $(s.sunriseTarget).text(sunrise);
                }

                // if sunriseTarget isn't null
                if(s.sunsetTarget != null) {

                    var sunset = formatAMPM(data.sys.sunset);

                    // set humidity
                    $(s.sunsetTarget).text(sunset);
                }

                // if timeLastUpdatedTarget isn't null
                if(s.timeLastUpdatedTarget != null){
                    var timeLastUpdated = formatAMPM(data.dt);

                    $(s.timeLastUpdatedTarget).text(timeLastUpdated);
                }

                // run success callback
                s.success.call(this);
            },

            error: function(jqXHR, textStatus, errorThrown) {

                // run error callback
                s.error.call(this, textStatus);
            }
        });


        /**
         * A function to convert wind speed.
         * @param {String} unitFrom The original measurement unit.
         * @param {String} unitTo The new measurement unit.
         * @param {Number} value The wind speed measurement to be converted.
         * @returns {String} The converted wind speed measurement.
         */
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

                return parseFloat(windSpeed.toFixed(1))  + ' ' + unitTo;
            }
        }

        function convertTemperature(unitFrom, unitTo, value){

            if(value == null){
                return null;
            }
            else{
                var temperature;

                value = parseInt(value);

                // Fahrenheit to Celsius
                if(unitFrom === 'imperial' && unitTo === 'metric'){

                    temperature = ((value - 32) / 1.8);
                }
                // Celsius to Fahrenheit
                else if(unitFrom === 'metric' && unitTo === 'imperial'){
                    temperature = ((value * 1.8) + 32);
                }
                // Kelvin to Fahrenheit
                else if(unitFrom === 'standard' && unitTo === 'imperial'){
                    temperature = ((value * 1.8) - 459.67);
                }
                // Fahrenheit to Kelvin
                else if(unitFrom === 'imperial' && unitTo === 'standard'){
                    temperature = ((value + 459.67)*(5/9));
                }
                // Celsius to Kelvin
                else if(unitFrom === 'metric' && unitTo === 'standard'){
                    temperature = (value + 273.15);
                }
                // Kelvin to Celsius
                else if(unitFrom === 'standard' && unitTo === 'metric'){
                    temperature = (value - 273.15);
                }
                else if(unitFrom === 'metric' && unitTo === 'metric' ||
                    unitFrom === 'standard' && unitTo === 'standard' ||
                    unitFrom === 'imperial' && unitTo === 'imperial'){
                    return value + temperatureUnit(unitTo);;
                }
                else{
                    return parseFloat(value.toFixed(1)) + temperatureUnit(unitFrom);
                }
                if(temperature !== 'undefined') {
                    return parseFloat(temperature.toFixed(1)) + temperatureUnit(unitTo);
                }
            }

        }

        /**
         * A function to convert direction in degrees to general compass direction.
         * @param {Number} deg The value to be converted, in degrees.
         * @return {String} The converted compass direction.
         */
        function convertDegreesToCompass(deg){

            // The 16 general compass directions
            var compassDirections = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

            // There are 16 general compass directions.
            // Dividing 360 by 16 equals 22.5.
            // 0.5 is added to prevent ties.
            var directionIndex = null;
            if($.isNumeric(deg))
            {
                if(deg >=0){
                    directionIndex=+Math.round(((deg/22.5)+0.5)%16);
                    return compassDirections[directionIndex - 1];
                }
            }
            return null;
        }

        /**
         * A function to return temperature unit from measurement definition.
         * @param {String} measurement Measurement definition ('metric', 'imperial', 'standard').
         * @returns {String} The temperature unit.
         */
        function temperatureUnit(measurement){
            var unit;
            if(measurement == null){
                return null;
            }
            else{
                switch(measurement){
                    case 'metric':
                        unit = '°C';
                        break;
                    case 'imperial':
                        unit = '°F';
                        break;
                    case 'standard':
                        unit = '°K';
                        break;
                }
                return unit;
            }
        }

        function weatherIconName(defaultIconFileName){

            var iconName;
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

            return iconName;
        }
    }

})(jQuery);
