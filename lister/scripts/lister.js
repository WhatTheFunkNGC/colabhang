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
		var div, noItems, ul, li, i, l;									
		ul = document.createElement("ul");								// create element
		ul.listStyleType= "decimal"	;									// display numberd items
		noItems = gapi.hangout.data.getValue("listLength") || "0";		// get list Length
		//console.log("Begin display loop");
		for (i = 1; i <= noItems; i++) {
			li = document.createElement("li");							// Create new element to attach
			li.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			//console.log("added txtInput");
			li.appendChild(addDelButton(i));							// add delete button
			//console.log("Button Added");
			ul.appendChild(li);											// add list element to end of full list
			console.log("element added");	
		}
	div = document.getElementById("list");				// get element
	div.innerHTML = "";									// clear exsisitn displayed list
    div.appendChild(ul);								// add new List to HTML element
	
	};	
	
	//Remove List item (by overwriting and shifting items down)
	function removeListElement(itemNo) {												// itemNo = list element to omit
		var noItems, i, j;
		console.log("remove list function call " + itemNo);							
		noItems = gapi.hangout.data.getValue("listLength") || "0";						// get current number of list items
		j = itemNo;																		// set up j var
		for ( i = itemNo; i < noItems; i++) {
			j++;																		// j in loop always is i + 1
			gapi.hangout.data.setValue("listTxt" + i, gapi.hangout.data.getValue("listTxt" + j));	// save data in pos j into i
		}
		gapi.hangout.data.clearValue("listTxt" + j);									// Nullify top list element
		gapi.hangout.data.setValue("listLength", (parseInt(noItems, 10) - 1).toString());	//  -1 to value list total and save.
	};
	
	
//-------------------- Button creation -------------------------
	
	// add Delete list item button
	function addDelButton(itemNo) { 						// itemNo targets specific list item
		var delBut = document.createElement("img");			// create element
		delBut.name = "delBut" + itemNo;					// fill in element details
		delBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		delBut.width = 25;
		delBut.height = 25;
		delBut.align = "top";
		delBut.onclick = function() { 						// on click calls remove function with param targeting the specific line
				console.log("Delete Press");
				removeListElement(itemNo); 
		}; 
		return delBut;										// return button element
	};
	
	
	// add text input bar
	function addTxtInput(itemNo) { 
		var txtIn = document.createElement("input"); 					// create input element
		//delBut.name = "TxtIn" + itemNo;;
		txtIn.type = "text";											// of text type
		//txtIn.className = "css-class-name";							// set style will be implimented later
		txtIn.value = gapi.hangout.data.getValue("listTxt" + itemNo); 	// value = state value text
		txtIn.onchange = function() { 									// updates shared value with enterd txt
				console.log("TxtInputChanged"); 
				gapi.hangout.data.setValue("listTxt" + itemNo, txtIn.value); 
		}; 		
		return txtIn;													// return txtInput element
	};
	
		
  var Lister = new Lister();	
}(window));