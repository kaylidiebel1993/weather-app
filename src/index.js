let windIcon = new Skycons({ color: '#65863A'});
let tempIcon = new Skycons({ color: '#146EB4'}); 
let humIcon = new Skycons({  color: '#CC2027'});
let pressureIcon = new Skycons({ color: '#00AB6B'});

windIcon.set('wind', 'wind');
tempIcon.set('temp', 'partly-cloudy-day');
humIcon.set('hum', 'sleet');
pressureIcon.set('pressure', 'fog'); 

windIcon.play();
tempIcon.play(); 
humIcon.play();
pressureIcon.play(); 

const locationElement = document.querySelector('[data-location]'); 
const statusElement = document.querySelector('[data-status]'); 
const temperatureElement = document.querySelector('[datat-temperature]'); 
const realTempElement = document.querySelector('[data-real-temp]'); 
const humidityElement = document.querySelector('[data-humidity]');
const pressureElement = document.querySelector('[data-pressure]'); 
const windElement = document.querySelector('[data-wind]'); 
const windDirectionElement = document.querySelector('[data-wind-dir]'); 
const switchElement = document.querySelector('[data-unit-toggle]'); 
const metricSwitch = document.getElementById('[cel]');
const imperialSwitch = document.getElementById('[fah]');
const img = document.querySelector('img'); 

const search = document.querySelector('.city-search-button'); 

search.addEventListener('click', fetchWeather); 

async function fetchWeather(e) {
    const city = e.target.parentNode.parentNode.childNodes[1].value; 

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&unitsmetric&appid=8ab539598f978d8393e18c5fad7687f0`);
        const data = await res.json(); 

        setWeather(data); 

        switchElement.addEventListener('click', () => {
            initializeSwitch(data); 
        }); 

        metricSwitch.addEventListener('change', () => {
           setWeather(data);  
        });

        imperialSwitch.addEventListener('change', () => {
            setWeather(data); 
        });
    } catch (err) {
        alert('You have entered an invalid location or something went wrong.'); 
    }
}

function setWeather(data) {
    document.querySelectorAll('#hide').forEach((el) => el.classList.add('hidden')); 
    locationElement.textContent = data.name + ', ' + data.sys.country;
    statusElement.textContent = data.weather[0].main + ' - ' + data.weather[0].description;
    windElement.textContent = setWindSpeed(data); 
    windDirectionElement.textContent = setWindDirection(data);
    temperatureElement.textcontent = setTemperature(data); 
    realTempElement.textContent = 'Feels like: ' + setRealTemp(data);
    humidityElement.textContent = data.main.humidity + '%';
    pressureElement.textContent = data.main.pressure + ' pHa'; 

    const iconCode = data.weather[0].icon;
    const iconurl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; 
    img.setAttribute('src', iconUrl); 

    displayUnits(); 
}

function setTemperature(data) {
    let temp = data.main.temp; 
    if (!isMetric()) {
        temp = data.main.temp * (9/5) + 32; 
    }
    return Math.round(temp * 10) / 10; 
}

function setRealTemp (data) { 
    let realTemp = data.main.feels_like;
    if (!isMetric()) {
        realTemp = data.main.feels_like * (9/5) + 32; 
    }
    return Math.round(realTemp * 10) / 10; 
}

function setWindSpeed(data) {
    let speed = data.wind.speed;
    if (!isMetric()) {
        speed = data.wind.speed / 1.609; 
    }
    return Math.round(speed * 10) / 10; 
}

function setWindDirection(data) {
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']; 
    const degree = data.wind.deg; 
    const num = Math.round(degree / 22.5 + 0.5); 

    return arr[num % 16]; 
}

function isMetric() {
    return metricSwitch.checked; 
}

function displayUnits() {
    temperatureElement.textContent += isMetric() ? ' °C' : ' °F'; 
    realTempElement.textContent += isMetric() ? '°C' : '°F';
    windElement.textContent += isMetric() ? ' kph' : ' mph'; 
}

function initializeSwitch(data) {
    let metricUnits = !isMetric(); 
    metricSwitch.checked = metricUnits; 
    imperialSwitch.checked = !metricUnits; 
    setWeather(data); 
}