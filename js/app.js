import { weather } from "../Modules/main.js";
import { el } from "../Modules/dom.js";

el(".search button").addEventListener('click',function(){ // bei Klick auf die "Lupe" wird nach dem eingebenen Namen gesucht
  weather.search();
  weather.findMyPos();
})
el(".search-bar").addEventListener('keyup',function(event){ //  WENN die "Enter"-Taste gedrückt wird auch nach dem eingebenen Namen gesucht
  if(event.key === "Enter"){
    weather.search();
  }
})


window.onload = weather.findMyPos(); // Geolocation wird gesucht beim öffnen der Webseite