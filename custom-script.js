//Web socket
var ip = "10.10.80.136";
var socket = new WebSocket('ws://' + ip + ':8080');

socket.onopen = function () {
    console.log('WebSocket is connected.');
};

var geocoder = new WorldWind.NominatimGeocoder();

// fim web socket

var wwd = new WorldWind.WorldWindow("globe");

// plota globo simples
wwd.addLayer(new WorldWind.BMNGLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

// Named layer displaying Average Temperature data
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var layerName = "MOD_LSTD_CLIM_M";

// Called asynchronously to parse and create the WMS layer
var createLayer = function (xmlDom) {
    // Create a WmsCapabilities object from the XML DOM
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    // Retrieve a WmsLayerCapabilities object by the desired layer name
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    // Form a configuration object from the WmsLayerCapability object
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    // Modify the configuration objects title property to a more user friendly title
    wmsConfig.title = "Average Surface Temp";
    // Create the WMS Layer from the configuration object
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);

    // Add the layers to WorldWind and update the layer manager
    wwd.addLayer(wmsLayer);
};

// Called if an error occurs during WMS Capabilities document retrieval
var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
};

var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

// configurações do marker
placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0);

placemarkAttributes.imageSource = 'marker.png';
// fim configurações do marker

// ação do botão da lupa
document.getElementById('searchBtn').addEventListener('click', function (e) {
    var cityToFind = document.getElementById('cityToFind').value;
    moveTo(cityToFind);
    localStorage.setItem('c', cityToFind);
});

// acção do botão de temperatura
document.getElementById('tempBtn').addEventListener('click', function (e) {
    $.get(serviceAddress).done(createLayer).fail(logError);
    socket.send(JSON.stringify({ type: 'layer', layer: 'heat' }));
    return;
});

// pesquisa cordenadas e move globo
function moveTo(city) {
    $('.lds-ripple').removeClass('hide');

    geocoder.lookup(city, function (geocoder, result) {
        if (result.length > 0) {
            latitude = parseFloat(result[0].lat);
            longitude = parseFloat(result[0].lon);
            console.log(result[0])

            // WorldWind.Logger.log(
            //     WorldWind.Logger.LEVEL_INFO, city + ": " + latitude + ", " + longitude);

            // thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));

            $('.lds-ripple').addClass('hide');

            //   resgata coordenadas e rotaciona mapa
            var position = new WorldWind.Position(latitude, longitude);
            wwd.goTo(position);

            //   enviar posição
            socket.send(JSON.stringify({ type: 'move', lat: latitude, lon: longitude }));
        }
    });

    // $.ajax({
    //     type: "GET",
    //     url: 'https://geocode.xyz/Hauptstr.,+57632+' + city + '?json=1',
    //     success: function (result) {
    //         $('.lds-ripple').addClass('hide');

    //         // resgata coordenadas e rotaciona mapa
    //         var position = new WorldWind.Position(result.latt, result.longt);
    //         wwd.goTo(position);

    //         // enviar posição
    //         socket.send(JSON.stringify({ type: 'move', lat: result.latt, lon: result.longt }));

    //         // põe marker (ta ficando meio torto)
    //         //placeMarker(result.latt, result.longt);

    //     },
    //     error: function (textStatus, errorThrown) {
    //         console.warn('Erro ao pesquisar cordenadas da cidade');
    //         $('.lds-ripple').addClass('hide');
    //     }
    // });
}

function placeMarker(lat, lon) {
    var position = new WorldWind.Position(lat, lon, 1000.0);
    var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

    placemarkLayer.addRenderable(placemark);
}