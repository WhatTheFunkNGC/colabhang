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
	  
		//document.getElementById("btnAddItem").onclick =		// old method saved for refrance
        //this.btnAddItemClick.bind(this);

		
		gapi.hangout.data.onStateChanged.add(				// add callback event for list change
		this.displayListItems.bind(this)		
		);
		this.displayListItems();
		}	
	};	
  
  //-------------------- Functions -------------------------
  
	//Display list Items
	Lister.prototype.displayListItems = function () {	
		var div, noItems, ul, li, li2, i, j, l, userID, idListLength, user;									
		ul = document.createElement("table");								// create element
		noItems = gapi.hangout.data.getValue("listTxt") || "0";			// get list Length
		userID =  gapi.hangout.getLocalParticipantId();						// IS IS AN OLD COMMAND, should use getLocalParticipantId() but currently not functional
		if (parseInt(noItems) < 1){ addNewItemToList ("listTxt","1"); }	// if list empty add new blank
		for (i = 1; i <= noItems; i++) {
			li = document.createElement("tr");							// Create new element to attach
			li.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			li.appendChild(addDelButton(i));							// add delete button
			li.appendChild(addAddButton(i));							// add Add button
			li.appendChild(addIDAddButton(userID,i));					// add Add user sing button
			li.appendChild(addIDDelButton(userID,i));					// add Remove user sign button
			idListLength = gapi.hangout.data.getValue("listTxt" + i + "listID") || "0";	// get number of users singed to element i
			for (j = 1; j <= idListLength ; j++) {						// run through User Singed list for element and add image per user
				li.appendChild(userPicture(i,j));
			};
			
			ul.appendChild(li);											// add list element to end of full list	
		}
	div = document.getElementById("list");				// get element
	div.innerHTML = "";									// clear exsisitn displayed list
    div.appendChild(ul);								// add new List to HTML element
	
	};	
	
	/* signs user up to list element
	- userID : User ID to add
	- itemNo : Which List element */
	function addUserToElement(userID,itemNo) {
		var idListLength, i;
		idListLength = gapi.hangout.data.getValue("listTxt" + itemNo + "listID") || "0";			// get length of current list ID list
		for (i = 1; i <= idListLength; i++){														// ---
			if (userID == gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + i)){ return; };// ---Check for id exsisting already if so quit
		}																							// ---
		idListLength = (parseInt(idListLength, 10) + 1).toString();									// increase target list length
		addNewItemToList ("listTxt" + itemNo + "listID",idListLength,userID);						// add ID to list
	};
	
	/* Removes User signed up to list element
	- userID : User ID to remove
	- itemNo : Which List element */
	function removeUserFromElement(userID,itemNo) {
		var idListLength, i;
		idListLength = gapi.hangout.data.getValue("listTxt" + itemNo + "listID") || "0";			// get length of current list ID list
		for (i = 1; i <= idListLength; i++){														// ---
			if (userID == gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + i)){
				removeItemFromList("listTxt" + itemNo + "listID",i);
			};																						// ---Check for id exsisting already if so quit
		}																							// ---

	};
	
	
	/* Remove Genralised value system
	- listName : target shared list variable name (int ommited)
	- targetElement : Element number to remove from list */
	function removeItemFromList(listName,targetElement){
		var noItems, i, j;
		noItems = gapi.hangout.data.getValue(listName) || "0";										// get the list length
		j = targetElement;	
		for ( i = targetElement; i < noItems; i++) {
			j++;																					// j in loop always is i + 1
			gapi.hangout.data.setValue(listName + i, gapi.hangout.data.getValue(listName + j));		// save data in pos j into i
		}
		gapi.hangout.data.clearValue(listName + j);													// removes top variable holder
		gapi.hangout.data.setValue(listName, (parseInt(noItems, 10) - 1).toString());				// saves list length -1 to shared state
	};
	
	/* Remove Genralised value system
	- listName : target shared list variable name (int ommited)
	- targetLocation : Element number to remove from list
	- entryValue OPTIONAL : value to save in new list element */
	function addNewItemToList (listName,targetLocation,entryValue){	
		var noItems, i, j;
		noItems = gapi.hangout.data.getValue(listName) || "0"; 									// get current number of list items
		noItems = (parseInt(noItems, 10) + 1).toString();                						// add 1 to value and convert to string 
		gapi.hangout.data.setValue(listName, noItems);											// Commits new item value
		j = noItems;
		for ( i = noItems; i > targetLocation; i--) {											// loop down moving element values up
			j--;																				// j in loop always is i + 1
			gapi.hangout.data.setValue(listName + i, gapi.hangout.data.getValue(listName + j));	// save data in pos j into i
		}
		if(!entryValue){ var entryValue = "List item " + targetLocation;};						// TESTING if no Value to enter, defult to blank
		gapi.hangout.data.setValue(listName + targetLocation, entryValue); 						// create textvalue for list item					
		console.log("LIST OBJECT " + noItems + " Created with value ");
	};
	
//-------------------- Button creation -------------------------
	
	// add Delete list item button
	function addDelButton(itemNo) { 								// itemNo targets specific list item
		var delBut = document.createElement("img");					// create element
		delBut.name = "delBut" + itemNo;							// fill in element details
		delBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		delBut.width = 25;
		delBut.height = 25;
		delBut.align = "top";
		delBut.onclick = function() { 								// on click calls remove function with param targeting the specific line
				console.log("Delete Press");
				removeItemFromList("listTxt",itemNo);
		}; 
		return delBut;												// return button element
	};
	
	// add Add list item button
	function addAddButton(itemNo) { 									// itemNo targets specific list item
		var addBut = document.createElement("img");						// create element
		addBut.name = "addBut" + itemNo;								// fill in element details
		addBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/addBtn.jpg";
		addBut.width = 25;
		addBut.height = 25;
		addBut.align = "top";
		addBut.onclick = function() { 									// on click calls remove function with param targeting the specific line
				console.log("Add Press");
				var listL = (parseInt(itemNo, 10) + 1).toString(); 		// gets targets below current for new element
				addNewItemToList ("listTxt",listL); 					// adds blank list element below selected element
		}; 
		return addBut;													// return button element
	};
	
	// add Delete ID list item button
	function addIDDelButton(userID,itemNo) { 						// itemNo targets specific list item
		var delIDBut = document.createElement("img");				// create element
		delIDBut.name = "delIDBut" + itemNo;						// fill in element details
		delIDBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		delIDBut.width = 50;
		delIDBut.height = 50;
		delIDBut.align = "top";
		delIDBut.onclick = function() { 							// on click calls remove function with param targeting the specific line
				console.log("Del ID Press");
				removeUserFromElement(userID,itemNo);				// adds users ID to list element
		}; 
		return delIDBut;											// return button element
	};
	
	// add Add ID list item button
	function addIDAddButton(userID,itemNo) { 					// itemNo targets specific list item
		var addIDBut = document.createElement("img");			// create element
		addIDBut.name = "addIDBut" + itemNo;					// fill in element details
		addIDBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/addBtn.jpg";
		addIDBut.width = 50;
		addIDBut.height = 50;
		addIDBut.align = "top";
		addIDBut.onclick = function() { 						// on click calls remove function with param targeting the specific line
				console.log("Add ID press");
				addUserToElement(userID,itemNo);				// adds users ID to list element
		}; 
		return addIDBut;										// return button element
	};
	
	
	// add text input bar
	function addTxtInput(itemNo) { 
		var txtIn = document.createElement("input"); 					// create input element
		//delBut.name = "TxtIn" + itemNo;;
		txtIn.type = "text";											// of text type
		txtIn.size = "40";
		//txtIn.className = "css-class-name";							// set style will be implimented later
		txtIn.value = gapi.hangout.data.getValue("listTxt" + itemNo); 	// value = state value text
		txtIn.onchange = function() { 									// updates shared value with enterd txt
				gapi.hangout.data.setValue("listTxt" + itemNo, txtIn.value); 
		}; 		
		return txtIn;													// return txtInput element
	};
	
	// add Add ID list item button
	function userPicture(itemNo,idLoc) { 														
		var userPic = document.createElement("img");											// create element
		var userID = gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + idLoc) || "0"; 	// Get Persons ID
		var userObj = eval(gapi.hangout.getParticipantById(userID));							// Get person object and JSON convert
		userPic.src = userObj.person.image.url + "sz=50";										// Use Avatar as image (+ resize to 50x50)
		userPic.width = 50;
		userPic.height = 50;
		userPic.align = "top"; 
		return userPic;																			// return button element
	};
	
	
		
  var Lister = new Lister();	
}(window));