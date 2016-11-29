#Open Weather

A simple, lightweight jQuery plugin used to display the current weather of any city using the free <a href="http://openweathermap.org/api" target="_blank">OpenWeatherMap API</a>.

This plugin allows you to display the location, the current temperature, the current low temperature, the current high temperature, a description of the current weather, a weather icon, the humidity level, the wind speed, the time the sun will rise, and the time the sun will set.

<strong>An API key is not required but it is recommended. <a href="http://openweathermap.org/login">Register here</a> to obtain an OpenWeatherMap API key for your application.</strong>

<a href="https://robertattfield.com/whatstheweather/" target="_blank">See demo</a>. The demo is a work in progress, so please mind the 'minimalistic' design/layout at this stage, and visit it often to check on improvements :).

<strong>The current version of this plugin is 1.5.1.</strong>

#Instructions

##Installation of Required Dependencies
Before installing, make sure you have also installed the following required dependencies: JQuery, ~~jsonproxy, and URIjs~~. You can do so via Bower, NPM, or plain old download. 

<strong>For version 1.5.0+, jsonproxy was removed as it was constantly down. This was used to handle Cross Origin Resource Sharing (CORS) requests especially for HTTPS sites. Another more stable solution will be built in at a later date. For the time being, https://proxy.hackeryou.com is the proxy being used in this plugin. If you would like to know more about CORS, visit https://www.w3.org/TR/cors/.</strong>

###Using Bower
```
bower install jquery --save
```

###Using Node Package Manager (NPM)
```
npm install jquery --save
```

##Installation of Plugin

###Using Bower

You can install this package by executing the following in your shell:

```
bower install open-weather-updated
```

The above will install the latest package version. 

The package will install in 'bower_components' directory, unless specified by your .bowerrc file.

If installing the script via Bower, include the script, along with JQuery, URIjs, and jsonproxy like so:

```html
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/URIjs/src/URI.min.js"></script>
<script src="bower_components/jsonproxy/jsonp.js"></script>
<script src="bower_components/open-weather-updated/build/openWeather.min.js"></script>
```


###Using Node Package Manager (NPM)

If you prefer to install your packages/plugins using NPM, you can do so with the following command:

```
npm install open-weather-updated
```

By default, this will install the plugin in your 'node_modules' directory, unless specified differently.

You can include the plugin like so:

```html
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/URIjs/src/URI.min.js"></script>
<script src="node_modules/jsonproxy/jsonp.js"></script>
<script src="node_modules/open-weather-updated/build/openWeather.min.js"></script>
```

###Install Manually

Download and extract this repository to the root of your web application. 

For example, if I was to take this approach,I would download this repository to a 'js/libraries' folder.

Include jQuery, URIjs, jsonproxy, and the plugin in the head or footer of your page.

```html
<script src="js/libraries/jquery/dist/jquery.min.js"></script>
<script src="js/libraries/URIjs/src/URI.min.js"></script>
<script src="js/libraries/jsonproxy/jsonp.js"></script>
<script src="js/libraries/open-weather-updated/build/openWeather.min.js"></script>
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
	city: 'Dunedin,NZ'
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

<li>clear.png</li>

<li>clouds.png</li>

<li>rain.png</li>

<li>snow.png</li>

<li>storm.png</li>

<li>mist.png</li>

</ol>

To use custom icons create a directory where the icons will live and inside of that directory create two more directories, "day" and "night."

	/img/icons/weather/day/
	/img/icons/weather/night/
	
Place your custom icons inside the "day" and "night" directories and initialize the plugin using the customIcons option.

##Custom Background Images

If you enable this feature, your web page's background image will be set to one appropriate to the current weather condition.

For example, if it was a rainy day, the image 'images/weather/backgrounds/day/rain.png' will be set as the main page background.

For this to work, you will need to define a directory structure in the root of your website's file-system for 'day' and 'night' background images. An example is: 'images/weather/backgrounds/day', 'images/weather/backgrounds/night'.

The 'customBackgroundImages' attribute in the example (at the bottom of the README.md) must be set like so:

```js
$('.weather-temperature').openWeather({
	city: 'Dunedin,NZ',
	customBackgroundImages: 'path/to/weather/background/images/folder/'

});
```

For example, if I stored the day/night backgrounds in the 'images/weather/backgrounds' folder, this will be set to:

```js
$('.weather-temperature').openWeather({
	city: 'Dunedin,NZ',
	customBackgroundImages: 'images/weather/backgrounds/'

});
```

In each 'day' and night' folders described above, custom background images must be named as follows:
                                                  
<ol>

<li>clear.png</li>

<li>clouds.png</li>

<li>rain.png</li>

<li>snow.png</li>

<li>storm.png</li>

<li>mist.png</li>

</ol>

	
<em>* Note that if you are using custom background images, you must include all 12 images.</em>

####Options

#####<em>key: integer</em>
<p>A string that defines the OpenWeatherMap API key for your application (default: null).</p>

#####<em>lang: string</em>
<p>A string that defines the language (default: 'en').
<br />(English - en, Russian - ru, Italian - it, Spanish - sp, Ukrainian - ua, German - de, Portuguese - pt, Romanian - ro, Polish - pl, Finnish - fi, Dutch - nl, French - fr, Bulgarian - bg, Swedish - se, Chinese Traditional - zh_tw, Chinese Simplified - zh_cn, Turkish - tr)
</p>

#####<em>city: "city name, country / province/ state"</em>
<p>A string that defines the city (default: null).</p>

#####<em>lat: integer</em>
<p>An integer that defines the latitude (default: null).</p>

#####<em>lng: integer</em>
<p>An integer that defines the longitude (default: null).</p>

#####<em>placeTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the location name (default: null).</p>

#####<em>units: "metric / imperial / standard"</em>
<p>A string that defines the type of units (default: 'metric'). These measurement units are also the pre-defined API defaults.</p>

#####<em>descriptionTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the weather description (default: null).</p>

#####<em>minTemperatureTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the minimum temperature (default: null).</p>

#####<em>maxTemperatureTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the maximum temperature (default: null).</p>

#####<em>windSpeedTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the wind speed (default: null).</p>

#####<em>windSpeedUnit: "Kph / Mph / mps"</em>
<p>A string that defines the unit to measure wind speed (default: Kph).</p>

#####<em>windDirectionUnit: "degrees / compass"</em>
<p>A string that defines the unit to measure wind direction (default: compass).
<br />The compass directions will display one of these below:
<br />
<br />N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW.
</p>

#####<em>clickConvertWindDirection: "true / false"</em>
<p>A boolean which enables wind direction to be converted when clicked.
<br />Available units are 'degrees' and 'compass'.
</p>

#####<em>clickConvertTemperature: "true / false"</em>
<p>A boolean which enables wind direction to be converted when clicked.
<br />Available units are Celsius (metric), Fahrenheit (imperial), Kelvin (standard).
</p>

#####<em>clickConvertWindSpeed: "true / false"</em>
<p>A boolean which enables wind speed measurement to be converted when clicked.
<br />Available units are 'Mph', 'Kph', and 'mps' (meters per second).
</p>

#####<em>humidityTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the humidity (default: null).</p>

#####<em>sunriseTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the time of sunrise (default: null).</p>

#####<em>sunsetTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the time of sunset (default: null).</p>

#####<em>iconTarget: "id / class / element"</em>
<p>A string that defines the ID, class or element that will contain the icon image (default: null).</p>

#####<em>customIcons: "path"</em>
<p>A string that defines the path to the custom icons (default: null).</p>

#####<em>timeLastUpdatedTarget: "id /class / element"</em>
<p>A string that defines the ID, class or element that will contain the time which the weather was last updated (default: null).</p>

#####<em>success: function() {}</em>
<p>A function that runs after the plugin has successfully retrieved weather data. (default: function()).</p>

#####<em>error: function() {}</em>
<p>A function that runs if there was an error retrieving weather data. (default: function(message)).</p>

####Example:

```js
$(function() {
    $('.weather-temperature').openWeather({
        key: '27bb2c32da00b682f1fe4b3e2764cfe5',
        units: 'metric',
        lang: 'en',
        city: 'Dunedin,NZ',
        placeTarget: '.weather-place',
        descriptionTarget: '.weather-description',
        minTemperatureTarget: '.weather-min-temperature',
        maxTemperatureTarget: '.weather-max-temperature',
        windSpeedTarget: '.weather-wind-speed',
        windSpeedUnit: 'Kph',
        windDirectionUnit: 'compass',
        clickConvertTemperature: true,
        clickConvertWindDirection: true,
        clickConvertWindSpeed: true,
        windDirectionTarget: '.weather-wind-direction',
        humidityTarget: '.weather-humidity',
        iconTarget: '.weather-icon',
        customIcons: '/img/icons/weather/',
	    customBackgroundImages: 'images/weather/backgrounds/',
        timeLastUpdatedTarget: '.weather-time-last-updated',
        success: function() {
            $('.weather-wrapper').show();
        },
        error: function(message) {
            console.log(message);
        }
    });
});
```
