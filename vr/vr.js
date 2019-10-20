var wwd1 = new WorldWind.WorldWindow("globe1");
var wwd2 = new WorldWind.WorldWindow("globe2");

// plota globo simples
wwd1.addLayer(new WorldWind.BMNGOneImageLayer());
wwd1.addLayer(new WorldWind.BMNGLandsatLayer());

wwd2.addLayer(new WorldWind.BMNGOneImageLayer());
wwd2.addLayer(new WorldWind.BMNGLandsatLayer());

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
}
function responsividadeCanvas(width) {
			if (width < 800) {
				document.getElementById('globe1').style.width = (width-50)+"px";
				document.getElementById('globe1').style.height = (width-50)+"px";
				document.getElementById('globe2').style.width = (width-50)+"px";
				document.getElementById('globe2').style.height = (width-50)+"px";
			}else{
				document.getElementById('globe1').style.width = "500px";
				document.getElementById('globe1').style.height = "500px";
				document.getElementById('globe2').style.width = "500px";
				document.getElementById('globe2').style.height = "500px";
			}
		}