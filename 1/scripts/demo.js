(function (window) {	
  "use strict";	
  	
  function HangoutDemo() {	
    console.log("Starting...");	
  gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  	
  HangoutDemo.prototype.onApiReady = function (event) {	
    if (event.isApiReady === true) {	
      console.log("API Ready");	
      // we can start doing stuff here	
    }	
  };
  
  var hangoutDemo = new HangoutDemo();	
}(window));