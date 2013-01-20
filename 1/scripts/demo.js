(function (window) {	
  "use strict";	
  	
  function HangoutDemo() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  	
  HangoutDemo.prototype.onApiReady = function (event) {	
    if (event.isApiReady === true) {	
      console.log("API Ready");	
	  gapi.hangout.onParticipantsChanged.add(	// add callback for events in here
        this.onParticipantsChanged.bind(this)
		console.log("Check");		
      );
      // we can start doing stuff here	
	  document.getElementById("clickme").onclick = 	// callback for button-click
        this.buttonClick.bind(this);
		gapi.hangout.data.onStateChanged.add(	// add callback for event
        this.displayCount.bind(this)	
      );
	  this.displayCount.bind(this);
	this.displayParticipants();
	  console.log("done");	
    }	
  };	
  HangoutDemo.prototype.displayCount = function () {	
    var value = gapi.hangout.data.getValue("count") || "0";	// read current count from state
    document.getElementById("count").innerHTML = value;	// display current count
  };
  
   HangoutDemo.prototype.buttonClick = function () {	
    var value = gapi.hangout.data.getValue("count") || "0";	// read current count from state
    value = (parseInt(value, 10) + 1).toString();	// increment count by one
    gapi.hangout.data.setValue("count", value);	// write new count into state
  };
  
  HangoutDemo.prototype.onParticipantsChanged = function (event) {	// sorts out ON change, so function is re-called when needed
    var div = document.getElementById("container");	
    div.innerHTML = "";	// make sure our container is empty before displaying the list
    this.displayParticipants();	
  };
  
  HangoutDemo.prototype.displayParticipants = function () {
	var div, participants, ul, li, i, l;
	console.log("Running");	
	participants = gapi.hangout.getParticipants();
	ul = document.createElement("ul");
	l = participants.length;
		for (i = 0; i < l; i++){
		li = document.createElement("li");
		if (participants[i].person) {
		li.innerHTML = participants[i].person.displayName; // add name to list if available
		} else {
			li.innerHTML = "unknown";
		}
			ul.appendChild(li);
	}
			div = document.getElementById("container");
			div.appendChild(ul);
};
			
  	
  var hangoutDemo = new HangoutDemo();	
}(window));