import { el,create} from "./dom.js";


// Object mit allen Daten
export let weather = {
    apiKey : "df8fab3fc7083aa7d6044179793c0995", // API Key
    loadJSON : async function(url){ // JSON Funktion zum auslesen
        const data = await (await fetch(url)).json();
        return data;
    },
    fetchWeather: async function(city){ // Function um LINK für WetterDaten mit der URL zu verändern 
        const url  = "https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=metric&appid=" 
        + this.apiKey;

        const data = await weather.loadJSON(url); // Wetterdaten laden
        this.displayWeather(data); // Wetter anzeigen und Daten übergeben mit Parameter
        console.log(data);
        this.weatherForeCast(data.coord.lat,data.coord.lon); // um Längen-, und Breitengrad-Daten zu kriegen in der foreCast Funktion
    },
    displayWeather: function(data){ // Funktion um Daten von JSON ins DOM zu übergeben
        const { name } = data; // Name der Stadt
        const { icon,description } = data.weather[0]; // Beschreibung und ICON 
        const { temp,humidity} = data.main; // Temperatur und Feuchtigkeit 
        const { speed } = data.wind; // Windgeschwindigkeit
        
        // Anzeige im DOM der Daten vom Object 
        el(".city").innerText = `Weather in ${name}`; // Name wird an DOM Element übergeben
        el(".temp").innerText = temp.toFixed(1) + " " + "°C"; // Temperatur wird an DOM Element übergeben
        el(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"; // ICON wird in den LINK hinzugefügt um es dynamisch zum Wetter der Stadt anzupassen
        el(".description").innerText = description; // Beschreibung der Wetterlage wird an DOM Element übergeben
        el(".humidity").innerText = `Humidity: ${humidity}%`; // Feuchtigkeit wird an DOM Element übergeben
        el(".windspeed").innerText = `Windspeed: ${speed} km/h`; // Windgeschwindigkeit wird an DOM Element übergeben
        el(".weather").classList.remove("loading"); // Wetterdaten werden versteckt solange die Daten geladen werden
        document.body.style.backgroundImage = "url('https://source.unsplash.com/random/1920x1080/?" + name + "')"; // Hintergrundbild wird dynamisch mit einem Link erzeugt der gesuchten Stadt
        
        // SonnenAufgang und SonnenUntergang
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Sonnenaufgang Zeit in lesbares Format
        const sunsetTime =  new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Sonnenuntergang Zeit in lesbares Format
        el("#sunrise").innerText = sunriseTime; // im DOM anzeigen
        el("#sunset").innerText = sunsetTime; // im DOM anzeigen
        //Meine neue Änderung
        const hallo = null;
        // Neuer Kommi
        
    },
    search: function(){
        this.fetchWeather(el(".search-bar").value); // this = weatherObject, Value von der SearchBar wird an die FetchWeather Funktion übergeben
    },
    findMyPos: function(){
        
        const success = (position) => { // wenn Location zugelassen wird
            const latitude = position.coords.latitude; // Breitengrad vom Object 
            const longitude = position.coords.longitude; // Längengrad vom Object 
            
            this.weatherForeCast(latitude,longitude); // Daten von Wettervorraussage werden bei Erlaubnis des Standortes geladen
            
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            this.loadJSON(url).then(location =>{ // lädt loadJSON Funktion = (Promise) danach mit .then() wartet bis die Funktion fertig ist und gibt Daten zurück 
                const city =  location.city; // City Eigenschaft vom Object
                this.fetchWeather(city); // führt fetchWeather aus mit City Variable
            });  
        }   
        const error = () => { // Wenn Location nicht zugelassen wird!
            el(".city").innerText = this.fetchWeather("Berlin"); // Berlin wird als Default angegeben
        }
        navigator.geolocation.getCurrentPosition(success, error);
    },
    weatherForeCast: function(latitude,longitude){
                    
                    // Wetter 7 Tage DATEN
                    const urlForeCast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=df8fab3fc7083aa7d6044179793c0995&units=metric`;
                    this.loadJSON(urlForeCast).then(data => { // Daten laden von API
                        const array = data.list; // Array von API
                        function filterTimeData(array,time){ // Array wird nach bestimmten Zeiten im JSON gefiltert
                            return  array.filter((obj) => obj.dt_txt.split(' ')[1] === time) // teilt Datum und Zeit voneinander ohne ein neues Array zu machen
                          }
                        const timeData = filterTimeData(array,'06:00:00'); // Parameter werden übergeben bei Aufruf/Filterkriterie ist 6:00 Uhr 
                        
                        console.log(timeData);
                        el('.forecast-card-wrapper').innerHTML = ""; // Vorrauschau wird geleert damit nicht dazu addiert wird
                        
                        timeData.forEach((day) => {
                            const dayName = new Date(day.dt * 1000).toLocaleDateString('en-us', { weekday:"short"}); // wandelt ein Timestamp in Millisekunden und ändert es auf ein lesbares Format

                            // Dynamisch erzeugte HTML Elemente für die Vorhersage
                            const div = create('div');
                            div.className = "forecast-card";
                            const h1 = create('h1');
                            h1.className = "day";
                            h1.innerText = dayName;
                            const h2 = create('h2');
                            h2.className = "temp";
                            h2.innerText = Math.round(day.main.temp * 10) / 10 + " °C"; // 10,98 -> 109,8 -> 110 -> 11
                            const img = create('img');
                            img.className = "icon";
                            img.src = "https://openweathermap.org/img/wn/" + day.weather[0].icon + ".png";
                            el('.forecast-card-wrapper').append(div);
                            div.append(h1);
                            div.append(h2);
                            div.append(img);
                        })
                    })
                    // Wetter 7 Tage DATEN ENDE 
    }
}

  

  
  