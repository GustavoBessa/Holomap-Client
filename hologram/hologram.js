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

//HEAT
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
    wwd1.addLayer(wmsLayer);
    wwd2.addLayer(wmsLayer);
    wwd3.addLayer(wmsLayer);
    wwd4.addLayer(wmsLayer);
};

// Called if an error occurs during WMS Capabilities document retrieval
var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
};
// FIM HEAT

var ip = "10.10.80.136";
var socket = new WebSocket('ws://' + ip + ':8080');

socket.onopen = function (event) {
    console.log('WebSocket is connected.');
};

socket.onmessage = function (e) {
    var obj = JSON.parse(e.data);
    console.table(e.data);
    if (obj.type == 'layer') {
        console.table(obj.type);
        $.get(serviceAddress).done(createLayer).fail(logError);
    } else {
        mudaMapa(obj);
    }
};

function mudaMapa(cord) {
    var position = new WorldWind.Position(cord.lat, cord.lon);
    wwd1.goTo(position);
    wwd2.goTo(position);
    wwd3.goTo(position);
    wwd4.goTo(position);
}