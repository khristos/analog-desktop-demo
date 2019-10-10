/*!
 * measureware v0.0.1
 * MeasureWARE project.
 * (c) 2019 ADI
 * ADI License
 * https://bitbucket.analog.com
 */

/**
 * @file: mw.internal.inline.js
 */

//console.log('mw.internal.inline.js file loaded');

// ADI Object
if (typeof ADI === 'object') { if (typeof ADI.Config === 'object') { } else { ADI.Config = {}; } } else { ADI = {}; ADI.Config = {}; }
ADI.Config.GetUserHomeData = 'https://my.analog.com/client/MyAnalog/GetUserHomeData';
ADI.Config.digiKeyPartDetails = 'https://analog.com/AnalogService.svc/GetDigiKeyPartDetails';
var filesTobeLoadedURL = [];
//'https://www.analog.com/lib/scripts/products/details/default.js'

function downloadJSAtOnload() {
    for (var i = 0; i < filesTobeLoadedURL.length; i++) {
        var element = document.createElement("script");
        element.src = filesTobeLoadedURL[i];
        document.body.appendChild(element);
    }
}
if (window.addEventListener)
    window.addEventListener("load", downloadJSAtOnload, false);
else if (window.attachEvent)
    window.attachEvent("onload", downloadJSAtOnload);
else window.onload = downloadJSAtOnload;