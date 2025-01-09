const condition = document.getElementById('condition');
const city = document.getElementById('city');
const country = document.getElementById('country');
const mainText = document.getElementById('main');
const description = document.getElementById('description');
const temp = document.getElementById('temp');
const pressure = document.getElementById('pressure');
const humidity = document.getElementById('humidity');

const cityInput = document.getElementById('city-input');
const historyElm = document.getElementById('history');
const masterHistory = document.getElementById('master-history');



const API_KEY = 'your api key here';

const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;
const ICON_URL = 'http://openweathermap.org/img/wn/';
const DEFAULT_CITY = "khulna,bd"

window.onload = function () {
    navigator.geolocation.getCurrentPosition(s => {
        getLocation(null, s.coords)
    }, e => {
        getLocation()
    }
    )

    axios.get('/api/history')
        .then(({ data }) => {
            // console.log(data);

            if (data.length > 0) {
                updateHistory(data)
            } else {
                historyElm.innerHTML = "There is no history, YET"
            }
        })
        .catch(e => {
            console.log(e);
        })


    cityInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            if (e.target.value) {
                getLocation(e.target.value, null, weather => {
                    e.target.value = ''
                    axios.post('/api/history', weather)
                        .then(({ data }) => {
                            updateHistory(data)
                        })
                        .catch(e => {
                            console.log(e);
                        })

                })
            } else {
                alert("enter a valid city")
            }
        }

    })
}

function getLocation(city = DEFAULT_CITY, coords, callback) {
    let url = BASE_URL
    city === null ?
        url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}` :
        url = `${url}&q=${city}`

    axios.get(url)
        .then(({ data }) => {
            let weather = {
                icon: data.weather[0].icon,
                name: data.name,
                country: data.sys.country,
                main: data.weather[0].main,
                description: data.weather[0].description,
                temp: data.main.temp,
                pressure: data.main.pressure,
                humidity: data.main.humidity
            }
            //TODO -> ✔
            setWeather(weather)
            if (callback) callback(weather)
        })
        .catch(e => {
            alert("City hasn't been found")
        })
}

function setWeather(weather) {
    condition.src = `${ICON_URL}${weather.icon}.png`
    city.innerHTML = weather.name
    country.innerHTML = weather.country
    mainText.innerHTML = weather.main
    description.innerHTML = weather.description
    temp.innerHTML = weather.temp
    pressure.innerHTML = weather.pressure
    humidity.innerHTML = weather.humidity
}

function updateHistory(history) {
    historyElm.innerHTML = ""
    history = history.reverse()

    history.forEach(element => {
        let tempHistory = masterHistory.cloneNode(true)
        tempHistory.id = ''
        //todo
        // console.log(tempHistory.getElementsByClassName("city"));

        tempHistory.getElementsByClassName("condition")[0].src = `${ICON_URL}${element.icon}.png`
        tempHistory.getElementsByClassName("city")[0].innerHTML = element.name
        tempHistory.getElementsByClassName("country")[0].innerHTML = element.country
        tempHistory.getElementsByClassName("main")[0].innerHTML = element.main
        tempHistory.getElementsByClassName("description")[0].innerHTML = element.description

        tempHistory.getElementsByClassName("temp")[0].innerHTML = element.temp
        tempHistory.getElementsByClassName("pressure")[0].innerHTML = element.pressure
        tempHistory.getElementsByClassName("humidity")[0].innerHTML = element.humidity

        historyElm.appendChild(tempHistory)
    });
}
