(function (window) {	
  	
  function Lister() {	
    console.log("Starting Lister");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  	
  Lister.prototype.onApiReady = function (event) {	
    if (event.isApiReady === true) {	
      console.log("Lister Ready");	
      // we can start doing stuff here	
    }	
  };	
  	
  var Lister = new Lister();	
}(window));