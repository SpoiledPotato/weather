var apiKey = 'f70aec795bdb4b4fa9180136220207'
var api = 'http://api.weatherapi.com/v1'

var dataMap = {};

const map = {
    'ა': 'a', 'ბ': 'b',
    'გ': 'g', 'დ': 'd',
    'ე': 'e', 'ვ': 'v',
    'ზ': 'z', 'თ': "t'",
    'ი': 'i', 'კ': 'k',
    'ლ': 'l', 'მ': 'm',
    'ნ': 'n', 'ო': 'o',
    'პ': 'p', 'ჟ': 'j',
    'რ': 'r', 'ს': 's',
    'ტ': 't', 'უ': 'u',
    'ფ': "p'", 'ქ': "k'",
    'ღ': 'g', 'ყ': 'q',
    'შ': 'sh', 'ჩ': 'ch',
    'ც': "ts'", 'ძ': 'dz',
    'წ': 'ts', 'ჭ': 'ch',
    'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
}

const cities = [
    "tbilisi", "rustavi", "gori", "batumi", "kutaisi", "t'elavi", "surami", "zugdidi", "zestap'oni", "t'erjola"
]

function changeToLatin(georgianText) {
    let latinText = '';
    Array.from(georgianText).forEach(char => {
        latinText += map[char] ? map[char] : char;
    });
    return latinText;
}

async function getCurrent(city) {
    city = changeToLatin(city);
    const response = await fetch(`${api}/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`);
    return response.json();
}

function updateUnits() {
    if (document.getElementById("unit").checked) {
        if (document.getElementById("minMax")) {
            let cityName;
            for (const key in dataMap) {
                cityName = key;
            }
            document.getElementById("minMax").innerHTML = `Day: ${dataMap[cityName].forecast.forecastday[0].day.maxtemp_f}℉ • Night: ${dataMap[cityName].forecast.forecastday[0].day.mintemp_f}℉`
        }

        const degrees = document.getElementsByClassName("degree");
        for (let i = 0; i < degrees.length; i++) {
            const id = degrees[i].parentElement.id;
            if (id) {
                degrees[i].innerHTML = dataMap[id].current.temp_f + '℉'
            } else {
                let cityName;
                for (const key in dataMap) {
                    cityName = key;
                }
                degrees[i].innerHTML = `Day: ${dataMap[cityName].forecast.forecastday[i - 1].day.maxtemp_f}℉ Night: ${dataMap[cityName].forecast.forecastday[i - 1].day.mintemp_f}℉`
            }
        }
        const wind_speed = document.getElementsByClassName("wind");
        for (let i = 0; i < wind_speed.length; i++) {
            const id = wind_speed[i].parentElement.id;
            wind_speed[i].innerHTML = dataMap[id].current.wind_mph + ' mph'
        }
    } else {
        if (document.getElementById("minMax")) {
            let cityName;
            for (const key in dataMap) {
                cityName = key;
            }
        document.getElementById("minMax").innerHTML = `Day: ${dataMap[cityName].forecast.forecastday[0].day.maxtemp_c}℃ • Night: ${dataMap[cityName].forecast.forecastday[0].day.mintemp_c}℃`
        }

        const degrees = document.getElementsByClassName("degree");
        for (let i = 0; i < degrees.length; i++) {
            const id = degrees[i].parentElement.id;
            if (id) {
                degrees[i].innerHTML = dataMap[id].current.temp_c + '℃'
            } else {
                let cityName;
                for (const key in dataMap) {
                    cityName = key;
                }
                degrees[i].innerHTML = `Day: ${dataMap[cityName].forecast.forecastday[i - 1].day.maxtemp_c}℃ Night: ${dataMap[cityName].forecast.forecastday[i - 1].day.mintemp_c}℃`
            }
        }
        const wind_speed = document.getElementsByClassName("wind");
        for (let i = 0; i < wind_speed.length; i++) {
            const id = wind_speed[i].parentElement.id;
            wind_speed[i].innerHTML = dataMap[id].current.wind_kph + ' km/h'
        }
    }
}

function addElement() {
    const container = document.querySelector('#append-elements');
    dataMap = {};
    cities.forEach(city => {
        getCurrent(city).then(data => {
            dataMap[data.location.name] = data;
            const doc = document.createElement('div');
            const doc_city = document.createElement('p');
            const weatherImage = document.createElement('img');
            const doc_temp = document.createElement('p');
            const doc_arrow = document.createElement('img');
            const doc_wind = document.createElement('span');

            doc.id = data.location.name

            doc.onclick = test;
            function test() {
                window.location.href = "city.html?city=" + data.location.name;
            }

            doc_city.innerHTML = doc.id;
            doc.classList.add('card');
            weatherImage.src = 'https://' + data.current.condition.icon;
            doc_temp.classList.add('degree')
            doc_arrow.src = 'img/arrow_up.png'
            doc_arrow.style.width = '30px'
            doc_arrow.style.transform = 'rotate(' + data.current.wind_degree + 'deg)'
            doc_wind.classList.add('wind')

            doc.appendChild(weatherImage);
            doc.appendChild(doc_city);
            doc.appendChild(doc_temp);
            doc.appendChild(doc_arrow);
            doc.appendChild(doc_wind);

            if (data.current.is_day == 1) {
                doc.style.backgroundImage = 'url("img/day.jpg")';
            } else {
                doc.classList.add('night');
                doc.style.backgroundImage = 'url("img/night.jpg")';
            }

            container.appendChild(doc);

            updateUnits()
        });
    });
}

function fillDetails(city) {
    getCurrent(city).then(data => {
        dataMap[data.location.name] = data;
        document.title = data.location.name + ' Weather';

        document.getElementById("cityName").innerText = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        const cityCard = document.getElementById("CITYNAME");
        cityCard.id = data.location.name;
        if (data.current.is_day == 1) {
            cityCard.style.backgroundImage = 'url("img/day.jpg")';
        } else {
            cityCard.classList.add('night');
            cityCard.style.backgroundImage = 'url("img/night.jpg")';
        }

        document.getElementById("weatherImage").src = 'https:' + data.current.condition.icon;

        const date = new Date(data.current.last_updated);
        const onlytime = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
        document.getElementById("time").innerHTML = `As of ${onlytime}`
        document.getElementById("wind").style.transform = 'rotate(' + data.current.wind_degree + 'deg)'
        updateUnits();
        fillForecast(data.location.name);
    })
}

function fillForecast(city) {
    const collection = document.getElementsByClassName('daily');
    console.log(dataMap);
    const forecastData = dataMap[city].forecast.forecastday;
    for (let i = 0; i < collection.length; i++) {
        const card = collection[i];
        const children = card.children;
        const date = new Date(forecastData[i].date)
        children[0].innerHTML = date.toLocaleDateString('en-US', {
            weekday: 'long',
        });
        children[1].setAttribute('src', `https:${forecastData[i].day.condition.icon}`);
        card.style.backgroundImage = 'url("img/day.jpg")';
    }
}