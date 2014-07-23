var Ci = Components.interfaces;
var Cr = Components.results;

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
var appWindow;
function HttpRequestLogger() {
  var httpRequestLogger =
  {
    observe: function(subject, topic, data) 
    {
      Components.utils.reportError(topic);
      if (topic == "http-on-modify-request") {
        var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        if(appWindow == null){
          appWindow  = loadContextGoodies(httpChannel);
        }
        var myDocument = appWindow.document;
        var element = myDocument.getElementById('httpcount');
        if (element == null){
          element = myDocument.createElement("HttpRequestCount");
          element.setAttribute("id", "httpcount");
          element.setAttribute("count",1);
          myDocument.documentElement.appendChild(element);
        } else {
          element.setAttribute("count",(parseInt(element.getAttribute('count'))+1));
        }
      }
    }
  };

  var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
  observerService.addObserver(httpRequestLogger, "http-on-modify-request", false);

  //this function gets the contentWindow and other good stuff from loadContext of httpChannel
  function loadContextGoodies(httpChannel) {
    var loadContext;
    try {
      var interfaceRequestor = httpChannel.notificationCallbacks.QueryInterface(Ci.nsIInterfaceRequestor);
      try {
        loadContext = interfaceRequestor.getInterface(Ci.nsILoadContext);
      } catch (ex) {
        try {
          loadContext = subject.loadGroup.notificationCallbacks.getInterface(Ci.nsILoadContext);
        } catch (ex2) {}
      }
    } catch (ex0) {}

    if (!loadContext) {
      return null;
    } else {
      var contentWindow = loadContext.associatedWindow;
      if (!contentWindow) {
        return null;
      } else {
        return contentWindow;
      }
    }
  }
}

HttpRequestLogger.prototype.classID = Components.ID('{c4a9bb50-b9b2-11e0-a4dd-0800200c9a66}');
HttpRequestLogger.prototype.classDescription = 'Http Request Logger XPCOM Component';
HttpRequestLogger.prototype.contractID = '@prekageo/HttpRequestLogger;1';
var NSGetFactory = XPCOMUtils.generateNSGetFactory([HttpRequestLogger]);
