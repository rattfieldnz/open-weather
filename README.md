#Open Weather

A simple, lightweight jQuery plugin used to display the current weather of any city using the free <a href="http://openweathermap.org/api" target="_blank">OpenWeatherMap API</a>.

This plugin allows you to display the location, the current temperature, the current low temperature, the current high temperature, a description of the current weather, a weather icon, the humidity level, the wind speed, the time the sun will rise, and the time the sun will set.

<strong>An API key is not required but it is reccomended. <a href="http://openweathermap.org/login">Register here</a> to obtain an OpenWeatherMap API key for your application.</strong>

<a href="http://michael-lynch.github.io/open-weather/" target="_blank">See demo</a>

##Instructions

###Install via Bower

You can install this package by executing the following in your shell:

```
bower install open-weather-updated
```

Note: the original project from Michael Lynch can be installed using the following command:

```
bower install open-weather
```

The package will install in 'bower_components' directory, unless specified by your .bowerrc file.

If installing the script via Bower, include the script, along with JQuery like so:

```html
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="bower_components/open-weather-updated/build/openWeather.min.js"></script>
```

If you have installed JQuery with Bower, including the script could look like so:

```html
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/open-weather-updated/build/openWeather.min.js"></script>
```

###Install Manually

Download and extract this repository to the root of your web application. 

For example, if I was to take this approach,I would download this repository to a 'js/libraries' folder.

Include jQuery and the plugin in the head or footer of your page.

```html
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="/js/libraries/open-weather-updated/build/openWeather.min.js"></script>
```

###Basic Use

The only default output is the current temperature.

To display the current temperature, create an element on your page where the current temperature will be displayed.

```html
<div class="weather-temperature"></div>
```
    
Initialize the plugin targeting the class, ID or element that you've created with either the 'city' option or 'lat' and 'lng' options set.

```js
$('.weather-temperature').openWeather({
	city: 'Toronto,ON'
});
```
	
OR

```js
$('.weather-temperature').openWeather({
	lat: 30,
	lng: 25
});
```
	
##Custom Icons

The OpenWeatherMap API returns their own set of icons, however, if you don't want to use them, the plugin also allows you to use 6 custom icons for both day and night, so 12 in total. Custom icons must be named as follows:

<ol>

	<p>clear.png</p>
	
	<p>clouds.png</p>
	
	<p>rain.png</p>
	
	<p>snow.png</p>
	
	<p>storm.png</p>
	
	<p>mist.png</p>

</ol>

To use custom icons create a directory where the icons will live and inside of that directory create two more directories, "day" and "night."

	/img/icons/weather/day/
	/img/icons/weather/night/
	
Place your custom icons inside the "day" and "night" directories and initialize the plugin using the customIcons option.

```js
$('.weather-temperature').openWeather({
	city: 'Toronto,ON',
	customIcons: '/img/icons/weather/'
});
```
	
<em>* Note that if you are using custom icons you must include all 12 images.</em>

####Options

<p><em>key: integer</em>
<br />A string that defines the OpenWeatherMap API key for your application (default: null).
</p>

<p><em>lang: string</em>
<br />A string that defines the language (default: 'en').
<br />(English - en, Russian - ru, Italian - it, Spanish - sp, Ukrainian - ua, German - de, Portuguese - pt, Romanian - ro, Polish - pl, Finnish - fi, Dutch - nl, French - fr, Bulgarian - bg, Swedish - se, Chinese Traditional - zh_tw, Chinese Simplified - zh_cn, Turkish - tr)
</p>

<p><em>city: "city name, country / province/ state"</em>
<br />A string that defines the city (default: null).
</p>

<p><em>lat: integer</em>
<br />An integer that defines the latitude (default: null). 
</p>

<p><em>lng: integer</em>
<br />An integer that defines the longitude (default: null).
</p>

<p><em>placeTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the location name (default: null).
</p>

<p><em>units: "metric / imperial / standard"</em>
<br />A string that defines the type of units (default: 'metric'). These measurement units are also the pre-defined API defaults.
</p>

<p><em>descriptionTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the weather description (default: null).
</p>

<p><em>minTemperatureTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the minimum temperature (default: null).
</p>

<p><em>maxTemperatureTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the maximum temperature (default: null).
</p>

<p><em>windSpeedTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the wind speed (default: null).
</p>

<p><em>windSpeedUnit: "Kph / Mph / mps"</em>
<br />A string that defines the unit to measure wind speed (default: Kph).
</p>

<p><em>humidityTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the humidity (default: null).
</p>

<p><em>sunriseTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the time of sunrise (default: null).
</p>

<p><em>sunsetTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the time of sunset (default: null).
</p>

<p><em>iconTarget: "id / class / element"</em>
<br />A string that defines the ID, class or element that will contain the icon image (default: null).
</p>

<p><em>customIcons: "path"</em>
<br />A string that defines the path to the custom icons (default: null).
</p>

<p><em>success: function() {}</em>
<br />A function that runs after the plugin has successfully retrieved weather data. (default: function()).
</p>

<p><em>error: function() {}</em>
<br />A function that runs if there was an error retrieving weather data. (default: function(message)).
</p>

#####Example:

```js
$(function() {

    $('.weather-temperature').openWeather({
        lang: 'ru',
        city: 'Toronto, ON',
        placeTarget: '.weather-place',
        units: 'metric',
        descriptionTarget: '.weather-description',
        minTemperatureTarget: '.weather-min-temperature',
        maxTemperatureTarget: '.weather-max-temperature',
        windSpeedTarget: '.weather-wind-speed',
        windSpeedUnit: 'Kph',
        humidityTarget: '.weather-humidity',
        sunriseTarget: '.weather-sunrise',
        sunsetTarget: '.weather-sunset',
        iconTarget: '.weather-icon',
        customIcons: '/img/icons/weather/',
        success: function() {
            $('.weather-temperature').show();
        },
        error: function(message) {
            console.log(message);
        }
    });

});
```
