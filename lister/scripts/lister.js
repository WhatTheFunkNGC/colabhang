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
		console.log("LIST OBJECT " + tempLL + " Created");
	};	
  
	//Display list Items
	Lister.prototype.displayListItems = function () {	
		var div, noItems, ul, li, i, l;									// define variables
		ul = document.createElement("ul");								// create element
		noItems = gapi.hangout.data.getValue("listLength") || "0";		// get list Length
		//console.log("Begin display loop");
		for (i = 1; i <= noItems; i++) {
			li = document.createElement("li");							// Create new element to attach
			console.log("about to add txtInput");	
			li.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			console.log("added txtInput");
			//li.innerHTML = gapi.hangout.data.getValue("listTxt" + i);  // get list value and write into HTML line OLD METHOD
			//console.log("HTML added");
			li.appendChild(addDelButton(i));							// add delete button
			//console.log("Button Added");
			ul.appendChild(li);											// add list element to end of full list
			console.log("element added");	
		}
	div = document.getElementById("list");				// get element
	div.innerHTML = "";									// clear exsisitn displayed list
    div.appendChild(ul);								// add new List to HTML element
	
	};	
	
	// remove List item
	function removeListElement(itemNo) {
		console.log("remove list function call " + itemNo);
	};
	
	
//-------------------- Button creation -------------------------
	
	// add Delete list item button
	function addDelButton(itemNo) { 						// itemNo targets specific list item
		var delBut = document.createElement("img");			// create element
		delBut.name = "delBut" + itemNo;					// fill in element details
		delBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		delBut.width = 50;
		delBut.height = 50;
		delBut.align = "top";
		delBut.onclick = function() { console.log("Delete Press");removeListElement(itemNo); }; // on click calls remove function with param targeting the specific line
		//console.log("Button Created");
		return delBut;										// return button element
	};
	
	

	
	// add text input bar
	function addTxtInput(itemNo) { 
	console.log("Txt entry STARTED");
		var txtIn = document.createElement("input"); 					// create input element
			console.log("1");
		delBut.name = "TxtIn" + itemNo;
		console.log("2");
		txtIn.type = "text";											// of text type
		console.log("3");
		//txtIn.className = "css-class-name";							// set style will be implimented later
		txtIn.value = gapi.hangout.data.getValue("listTxt" + itemNo); 	// value = state value text
		//delBut.onchange = function() { console.log("TxtInputChanged"); gapi.hangout.data.setValue("listTxt" + tempLL, txtIn.value); }; // updates shared value with enterd txt
		console.log("Txt entry Created");
		return txtIn;													// return txtInput element
	};
	
		
  var Lister = new Lister();	
}(window));