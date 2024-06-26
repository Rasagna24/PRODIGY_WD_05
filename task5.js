document.getElementById('searchButton').addEventListener('click', getWeather);

function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'd6a1e31259264e09aab8136d02d70b18';
    const currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    Promise.all([
        fetch(currentApiUrl).then(response => response.json()),
        fetch(forecastApiUrl).then(response => response.json())
    ])
    .then(([currentData, forecastData]) => {
        displayWeather(currentData, city); // Display today's weather
        displayTomorrowForecast(forecastData); // Display tomorrow's forecast
        displayDayAfterForecast(forecastData); // Display day after forecast
        // Remove this line to stop changing background based on weather
        // setWeatherBackground(currentData.weather[0].description); 
        document.getElementById('errorMessage').classList.add('hidden');
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        document.getElementById('errorMessage').classList.remove('hidden');
    });
}

// Remove or comment out this function if you do not want to change the background
/*
function setWeatherBackground(description) {
    const weatherClass = getWeatherClass(description);
    document.body.className = weatherClass; // Set the class on the body element
}
*/

function displayWeather(data, city) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    const weatherIcon = getWeatherIcon(data.weather[0].icon);
    const weatherClass = getWeatherClass(data.weather[0].description);

    currentWeatherDiv.className = `weather-card ${weatherClass}`;
    currentWeatherDiv.innerHTML = `
        <h2>${formatDate(new Date())}</h2>
        <p>${city}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <img src="${weatherIcon}" alt="Weather Icon">
    `;
}

function displayTomorrowForecast(data) {
    const tomorrowWeatherDiv = document.getElementById('tomorrowWeather');
    const tomorrowData = findTomorrowForecast(data.list);

    if (tomorrowData) {
        const weatherIcon = getWeatherIcon(tomorrowData.weather[0].icon);
        const weatherClass = getWeatherClass(tomorrowData.weather[0].description);

        tomorrowWeatherDiv.className = `weather-card ${weatherClass}`;
        tomorrowWeatherDiv.innerHTML = `
            <h2>${formatDate(getTomorrowDate())}</h2>
            <p>Temperature: ${tomorrowData.main.temp}°C</p>
            <p>Weather: ${tomorrowData.weather[0].description}</p>
            <img src="${weatherIcon}" alt="Weather Icon">
        `;
    } else {
        tomorrowWeatherDiv.innerHTML = '<p>No forecast data available</p>';
    }
}

function displayDayAfterForecast(data) {
    const dayAfterWeatherDiv = document.getElementById('dayAfterWeather');
    const dayAfterData = findDayAfterForecast(data.list);

    if (dayAfterData) {
        const weatherIcon = getWeatherIcon(dayAfterData.weather[0].icon);
        const weatherClass = getWeatherClass(dayAfterData.weather[0].description);

        dayAfterWeatherDiv.className = `weather-card ${weatherClass}`;
        dayAfterWeatherDiv.innerHTML = `
            <h2>${formatDate(getDayAfterDate())}</h2>
            <p>Temperature: ${dayAfterData.main.temp}°C</p>
            <p>Weather: ${dayAfterData.weather[0].description}</p>
            <img src="${weatherIcon}" alt="Weather Icon">
        `;
    } else {
        dayAfterWeatherDiv.innerHTML = '<p>No forecast data available</p>';
    }
}

function findTomorrowForecast(list) {
    const tomorrowDate = getTomorrowDate().toISOString().split('T')[0];
    return list.find(item => item.dt_txt.includes(tomorrowDate));
}

function findDayAfterForecast(list) {
    const dayAfterDate = getDayAfterDate().toISOString().split('T')[0];
    return list.find(item => item.dt_txt.includes(dayAfterDate));
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

function getDayAfterDate() {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter;
}

function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getWeatherClass(description) {
    switch(description.toLowerCase()) {
        case 'clear sky':
            return 'clear-sky';
        case 'few clouds':
            return 'few-clouds';
        case 'scattered clouds':
            return 'scattered-clouds';
        case 'broken clouds':
            return 'broken-clouds';
        case 'shower rain':
            return 'shower-rain';
        case 'rain':
            return 'rain';
        case 'thunderstorm':
            return 'thunderstorm';
        case 'snow':
            return 'snow';
        case 'mist':
            return 'mist';
        default:
            return 'default';
    }
}
