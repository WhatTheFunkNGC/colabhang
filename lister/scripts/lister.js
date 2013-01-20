(function (window) {	
  	
  function Lister() {	
    console.log("Starting Lister");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  
  //-------------------- Listeners -------------------------
	
	// script start
  Lister.prototype.onApiReady = function (event) {	
    if (event.isApiReady === true) {	
      console.log("Lister Ready");	
      // we can start doing stuff here	
	  
	  document.getElementById("btnAddItem").onclick =	// attach button to function
        this.btnAddItemClick.bind(this);
	  
    }	
  };	
  
  //-------------------- Functions -------------------------
  
  // On Add Item Button push
  Lister.prototype.btnAddItemClick = function () {	
    var tempLL = gapi.hangout.data.getValue("listLength") || "0"; // get current number of list items
	tempLL = (parseInt(value, 10) + 1).toString();                // add 1 to value and convert to string 
    gapi.hangout.data.setValue("listLength", tempLL);	
  };	
  	
  var Lister = new Lister();	
}(window));