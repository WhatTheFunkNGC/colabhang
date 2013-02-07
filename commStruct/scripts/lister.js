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
	
		gapi.hangout.data.onStateChanged.add(				// add callback event for list change
		this.displayListItems.bind(this)		
		);
		this.displayListItems();
		}	
	};	
  
  //-------------------- Functions -------------------------
  
	//Display list Items
	Lister.prototype.displayListItems = function () {	
		var div, noItems, ul, li, li2, e1, e2, e3, e4, i, j, l, userID, idListLength, user;									
		ul = document.createElement("table");								// create element
		noItems = gapi.hangout.data.getValue("listTxt") || "0";			// get list Length
		userID =  gapi.hangout.getLocalParticipantId();					// get the current participants ID
		if (parseInt(noItems) < 1){ addNewItemToSharedList ("listTxt","1"); }	// if list empty add new blank
		for (i = 1; i <= noItems; i++) {
			li = document.createElement("tr");							// Create new element to attach
			e1 = document.createElement("td");
			e1.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			e1.appendChild(addDelButton(i));							// add delete button
			e1.appendChild(addAddButton(i));							// add Add button
			li.appendChild(e1);
			li2 = document.createElement("tr");
			e2 = document.createElement("td");
			e2.appendChild(addIDAddButton(userID,i));					// add Add user sing button
			e2.appendChild(addIDDelButton(userID,i));					// add Remove user sign button 
			idListLength = gapi.hangout.data.getValue("listTxt" + i + "listID") || "0";	// get number of users singed to element i
			console.log("1");
			for (j = 1; j <= idListLength ; j++) {						// run through User Singed list for element and add image per user
			console.log("2");
				e2.appendChild(userPicture(i,j));
				console.log("5");
			};
			li2.appendChild(e2);
			console.log("6");
			
			ul.appendChild(li);											// add list element to end of full list	
			ul.appendChild(li2);
		}
	div = document.getElementById("lister");				// get element
	div.innerHTML = "";									// clear exsisitn displayed list
    div.appendChild(ul);								// add new List to HTML element
	
	};	
	
	/* signs user up to list element
	- userID : User ID to add
	- itemNo : Which List element */
	//function addUserToElement(userID,itemNo) {
	//	var idListLength, i;
	//	idListLength = gapi.hangout.data.getValue("listTxt" + itemNo + "listID") || "0";			// get length of current list ID list
	//	for (i = 1; i <= idListLength; i++){														// ---
	//		if (userID == gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + i)){ return; };// ---Check for id exsisting already if so quit
	//	}																							// ---
	//	idListLength = (parseInt(idListLength, 10) + 1).toString();									// increase target list length
	//	addNewItemToSharedList ("listTxt" + itemNo + "listID",idListLength,userID);						// add ID to list
	//};
	
	/* Removes User signed up to list element
	- userID : User ID to remove
	- itemNo : Which List element */
	//function removeUserFromElement(userID,itemNo) {
	//	var idListLength, i;
	//	idListLength = gapi.hangout.data.getValue("listTxt" + itemNo + "listID") || "0";			// get length of current list ID list
	//	for (i = 1; i <= idListLength; i++){														// ---
	//		if (userID == gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + i)){
	//			removeItemFromSharedList("listTxt" + itemNo + "listID",i);
	//		};																						// ---Check for id exsisting already if so quit
	//	}																							// ---

	//};

	
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
				removeItemFromSharedList("listTxt",itemNo);
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
				addNewItemToSharedList ("listTxt",-1); 					// adds blank list element below selected element
		}; 
		return addBut;													// return button element
	};
	
	// add Delete ID list item button
	function addIDDelButton(userID,itemNo) { 						// itemNo targets specific list item
		var delIDBut = document.createElement("img");				// create element
		delIDBut.name = "delIDBut" + itemNo;						// fill in element details
		delIDBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		delIDBut.width = 25;
		delIDBut.height = 25;
		delIDBut.align = "top";
		delIDBut.onclick = function() { 							// on click calls remove function with param targeting the specific line
			console.log("Del ID Press");
			findAndRemoveItemFromSharedList("listTxt" + itemNo + "listID",userID);
		}; 
		return delIDBut;											// return button element
	};
	
	// add Add ID list item button
	function addIDAddButton(userID,itemNo) { 					// itemNo targets specific list item
		var addIDBut = document.createElement("img");			// create element
		addIDBut.name = "addIDBut" + itemNo;					// fill in element details
		addIDBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/addBtn.jpg";
		addIDBut.width = 25;
		addIDBut.height = 25;
		addIDBut.align = "top";
		addIDBut.onclick = function() { 						// on click calls remove function with param targeting the specific line
			console.log("Add ID press");
			findAndAddNewItemToSharedList("listTxt" + itemNo + "listID",userID);
		}; 
		return addIDBut;										// return button element
	};
	
	
	// add text input bar
	function addTxtInput(itemNo) { 
		var txtIn = document.createElement("input"); 					// create input element
		//delBut.name = "TxtIn" + itemNo;;
		txtIn.type = "text";											// of text type
		txtIn.size = "32";
		//txtIn.className = "css-class-name";							// set style will be implimented later
		txtIn.value = gapi.hangout.data.getValue("listTxt" + itemNo); 	// value = state value text
		txtIn.onchange = function() { 									// updates shared value with enterd txt
				gapi.hangout.data.setValue("listTxt" + itemNo, txtIn.value); 
		}; 		
		return txtIn;													// return txtInput element
	};
	
	// add Add ID pic
	function userPicture(itemNo,idLoc) { 														
		var userPic = document.createElement("img");											// create element
		var userID = gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + idLoc) || "0"; 	// Get Persons ID
		console.log("3  " + userID);
		var userObj = eval(gapi.hangout.getParticipantById(userID));							// Get person object and JSON convert
		userPic.src = userObj.person.image.url + "sz=25";										// Use Avatar as image (+ resize to 50x50)
		console.log("4");
		userPic.width = 25;
		userPic.height = 25;
		userPic.align = "top"; 
		return userPic;																			// return button element
	};
	
	
		
  var Lister = new Lister();	
}(window));