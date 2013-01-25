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
	  
		document.getElementById("btnAddItem").onclick =		// attach Add button to function
        this.btnAddItemClick.bind(this);
		
		
		gapi.hangout.data.onStateChanged.add(				// add callback event for list change
		this.displayListItems.bind(this)
		);
	  
		}	
	
	
	};	
  
  //-------------------- Functions -------------------------
  
  // On Add Item Button push
	Lister.prototype.btnAddItemClick = function () {	
		var tempLL = gapi.hangout.data.getValue("listLength") || "0"; 				// get current number of list items
		tempLL = (parseInt(tempLL, 10) + 1).toString();                				// add 1 to value and convert to string 
		gapi.hangout.data.setValue("listLength", tempLL);							// Commits new item value
		
		gapi.hangout.data.setValue("listTxt" + tempLL, "LIST OBJECT " + tempLL); 	// create shared text value for line under number
	};	
  
	//Display list Items
	Lister.prototype.displayListItems = function () {	
		var div, noItems, ul, li, i, l;									// define variables
		ul = document.createElement("ul");								// create element
		noItems = gapi.hangout.data.getValue("listLength") || "0";		// get list Length
		for (i = 1; i <= noItems; i++) {
			li = document.createElement("li");							// Create new element to attach
			li.innerHTML = gapi.hangout.data.getValue("listTxt" + i)  // get list value and write into HTML line
			ul.appendChild(li);											// add list element to end of full list
			
			
		}
	div = document.getElementById("list");				// get element
	div.innerHTML = "";									// clear exsisitn displayed list
    div.appendChild(ul);								// add new List to HTML element
	};	
	
	
	// remove List item
	//Lister.prototype.deleteListItem = function (ListItem i) {
	
	//}
	
	
		
  var Lister = new Lister();	
}(window));