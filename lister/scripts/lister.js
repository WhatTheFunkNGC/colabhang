(function (window) {	
  	
  function Lister() {	
    console.log("Starting Lister");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  
  //-------------------- Listeners -------------------------
	
	// script start and loop
	Lister.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {	
			console.log("Lister Ready");	
	  
		document.getElementById("btnAddItem").onclick =		// attach button to function
        this.btnAddItemClick.bind(this);
		
		gapi.hangout.data.onStateChanged.add(				// add callback event for list change
		this.displayListItems.bind(this)
		);
	  
		}	
	
	
	};	
  
  //-------------------- Functions -------------------------
  
  // On Add Item Button push
	Lister.prototype.btnAddItemClick = function () {	
		var tempLL = gapi.hangout.data.getValue("listLength") || "0"; 	// get current number of list items
		tempLL = (parseInt(tempLL, 10) + 1).toString();                	// add 1 to value and convert to string 
		gapi.hangout.data.setValue("listLength", tempLL);				// Commits new item value
	};	
  
	//Display list Items
	Lister.prototype.displayListItems = function () {	
		var div, noItems, ul, li, i, l;									// define variables
		ul = document.createElement("ul");								// create element
		noItems = gapi.hangout.data.getValue("listLength") || "0";		// get list Length
		for (i = 0; i < noItems; i++) {
			li = document.createElement("li");							// Create new element to attach
			li.innerHTML = "LIST ITEM " + noItems;						// generate list line
			ul.appendChild(li);												// add list element to end of full list
		}
	div = document.getElementById("list");				// get element
    div.appendChild(ul);								// add List to HTML element
	};	
	
		
  var Lister = new Lister();	
}(window));