import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import WeatherService from './services/weather-service.js';
import GiphyService from './services/giphy-service.js';
import MarsWeatherService from './services/mars-service.js';
import MarsImageService from '../mars-image-service.js';


function clearFields() {
  $('#location').val("");
  $('.show-errors').text("");
  $('.show-gif').text("");
  $('.show-mars').text("");
  $('.hidden-text').show();
}
function displayFunImage() {
  const url = "https://images-assets.nasa.gov/image/NHQ201905310033/NHQ201905310033~thumb.jpg"
  $('.show-response').html(`<img src='${url}'>`);
}

function displayWeatherDescription(description) {
  $('.weather-description').text(`The weather is ${description}!`);
}

function displayGif(response) {
  const url = response.data[0].images.downsized.url
  $('.show-earth-gif').html(`<img src='${url}'>`);
}

function displayMarsImage(response) {
  console.log(response.photos[0])
  const url = response.photos[0].img_src
  $('.show-mars-image').html(`<img width=50%' src='${url}'>`);
}
  
function displayMarsWeather(response) {
  const marsNdata = response[818].Northern_season
  const marsSdata = response[818].Southern_season
  let answer = `The season in the northern hemisphere is: ${marsNdata}
  <div>The season in the southern hemipshere is: ${marsSdata}</div>
  The time this picture was taken: 8:56pm 3/22/21`
  $('.show-mars-weather').html(answer);
}

function displayErrors(error) {
  $('.show-errors').text(`${error}`);
}

$(document).ready(function() {
  $('#weatherLocation').click(function() {
    let city = $('#location').val();
    clearFields();
    WeatherService.getWeather(city)
      .then(function(weatherResponse) {
        if (weatherResponse instanceof Error) {
          throw Error(`OpenWeather API error: ${weatherResponse.message}`);
        }
        const weatherDescription = weatherResponse.weather[0].description;
        displayWeatherDescription(weatherDescription);
        return GiphyService.getGif(weatherDescription);
      })
      .then(function(giphyResponse) {
        if (giphyResponse instanceof Error) {
          throw Error(`Giphy API error: ${giphyResponse.message}`);
        }
        displayGif(giphyResponse);
        return MarsWeatherService.getMarsWeather(); 
      })
      .then(function(marsWeatherResponse) {
        if (marsWeatherResponse instanceof Error) {
          throw Error(`Mars API error: ${marsWeatherResponse.message}`);
        }
        displayMarsWeather(marsWeatherResponse);
        return MarsImageService.getMarsImage();
      }).then(function(marsImageResponse) {
        if (marsImageResponse instanceof Error) {
          throw Error(`Mars API error: ${marsImageResponse.message}`);
        }
        displayMarsImage(marsImageResponse);
      }).then(function(marsImageResponse) {
        if (marsImageResponse instanceof Error) {
          throw Error(`Mars API error: ${marsImageResponse.message}`);
        }
        displayFunImage();
      })
      .catch(function(error) {
        displayErrors(error.message)
      })
  });
});