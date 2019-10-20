//Web socket

var socket = new WebSocket('ws://10.10.80.136:8080');

// Show a connected message when the WebSocket is opened.
socket.onopen = function (event) {
    console.log('WebSocket is connected.');
};

socket.onmessage = function (e) {
    var cord = JSON.parse(e.data);
    mudaMapa(cord);
};

function mudaMapa(cord) {
    var position = new WorldWind.Position(cord.lat, cord.lon);
    wwd.goTo(position);

    // põe marker (ta ficando meio torto)
    //placeMarker(cord.lat, cord.lon);
}

// fim web socket


var wwd = new WorldWind.WorldWindow("globe-aluno");

// plota globo simples
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

// melhor qualidade e controles
wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
// wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
// wwd.addLayer(placemarkLayer);

//var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

// configurações do marker
//placemarkAttributes.imageOffset = new WorldWind.Offset(
    // WorldWind.OFFSET_FRACTION, 0.3,
    // WorldWind.OFFSET_FRACTION, 0.0);

//placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
//placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    // WorldWind.OFFSET_FRACTION, 0.5,
    // WorldWind.OFFSET_FRACTION, 1.0);

//placemarkAttributes.imageSource = '../marker.png';

document.getElementById('searchBtn').addEventListener('click', function (e) {
    alert("shadow");
    var cityToFind = document.getElementById('cityToFind').value;
    moveTo(cityToFind);
    localStorage.setItem('c',cityToFind);
});

// pesquisa cordenadas e move globo
function moveTo(city) {
    $.ajax({
        type: "GET",
        url: 'https://geocode.xyz/Hauptstr.,+57632+' + city + '?json=1',
        success: function (result) {

            // resgata coordenadas e rotaciona mapa
            var position = new WorldWind.Position(result.latt, result.longt);
            wwd.goTo(position);
            
            // enviar posição
            socket.send(JSON.stringify({lat: result.latt, lon: result.longt}));

            // põe marker (ta ficando meio torto)
            //placeMarker(result.latt, result.longt);

        },
        error: function (textStatus, errorThrown) {
            console.warn('Erro ao pesquisar cordenadas da cidade');
            $('.lds-ripple').addClass('hide');
        }
    });
}

function placeMarker(lat, lon) {
    var position = new WorldWind.Position(lat, lon, 1000.0);
    var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

    placemarkLayer.addRenderable(placemark);
}