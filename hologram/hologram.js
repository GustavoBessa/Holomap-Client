var wwd1 = new WorldWind.WorldWindow("globe1");
var wwd2 = new WorldWind.WorldWindow("globe2");
var wwd3 = new WorldWind.WorldWindow("globe3");
var wwd4 = new WorldWind.WorldWindow("globe4");

// plota globo simples
wwd1.addLayer(new WorldWind.BMNGOneImageLayer());
wwd1.addLayer(new WorldWind.BMNGLandsatLayer());

wwd2.addLayer(new WorldWind.BMNGOneImageLayer());
wwd2.addLayer(new WorldWind.BMNGLandsatLayer());

wwd3.addLayer(new WorldWind.BMNGOneImageLayer());
wwd3.addLayer(new WorldWind.BMNGLandsatLayer());

wwd4.addLayer(new WorldWind.BMNGOneImageLayer());
wwd4.addLayer(new WorldWind.BMNGLandsatLayer());

var ip = "10.10.80.136";
var socket = new WebSocket('ws://' + ip + ':8080');

socket.onopen = function (event) {
    console.log('WebSocket is connected.');
};

socket.onmessage = function (e) {
    var cord = JSON.parse(e.data);
    mudaMapa(cord);
};

function mudaMapa(cord) {
    var position = new WorldWind.Position(cord.lat, cord.lon);
    wwd1.goTo(position);
    wwd2.goTo(position);
    wwd3.goTo(position);
    wwd4.goTo(position);
}