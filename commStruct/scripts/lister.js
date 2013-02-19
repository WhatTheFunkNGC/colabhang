(function (window) {	
  	
  function Lister() {	
    console.log("Starting Lister");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  
  //-------------------- VARS -------------------------	
  
  var tableId;
  
  
  //-------------------- Listeners -------------------------
	
	// script start and loop
	Lister.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {	
			console.log("Lister Ready");	
			listerTableSetup();
	
		gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {				// add callback event for list change
		add(stateChangeEvent.addedKeys,stateChangeEvent.removedKeys);
		});
		//this.displayListItems();
		
		}	
	};	
  
  //-------------------- Functions -------------------------
  
	//inital table setup and item
	function listerTableSetup(){
		var div, tb;
		div = document.getElementById("lister");				// get element
		div.innerHTML = "";									// clear exsisitn displayed list
		
		tb = document.createElement("table");
		tableId = tb.id;									// stores the table refrence
		div.appendChild(tb);								// add new List to HTML element
		addNewItemToSharedList ("listTxt","1");
	};
	
	
	
  
	//Display list Items
	Lister.prototype.displayListItems = function () {	
		var div, noItems, ul, li, li2, e1, e2, e3, e4, i, j, l, userID, idListLength, user;									
		ul = document.createElement("table");								// create element
		noItems = gapi.hangout.data.getValue("listTxt") || "0";			// get list Length
		userID =  gapi.hangout.getLocalParticipantId();						// get the current participants ID
		if (parseInt(noItems) < 1){ addNewItemToSharedList ("listTxt","1"); }
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
			for (j = 1; j <= idListLength ; j++) {						// run through User Singed list for element and add image per user
				e2.appendChild(userPicture(i,j));
			};
			li2.appendChild(e2);
			
			ul.appendChild(li);											// add list element to end of full list	
			ul.appendChild(li2);
		}
	div = document.getElementById("lister");				// get element
	div.innerHTML = "";									// clear exsisitn displayed list
    div.appendChild(ul);								// add new List to HTML element
	
	};	
	
	function add (addedKeys,removedKeys){
	var i;
	console.log("output");

	for (i = 0; i < addedKeys.length ; i++ ){
	var itemNo;
	if (addedKeys[i].key.indexOf("listTxt") !== -1){
		if (!isNan(addedKeys[i].key.charAt(8))){ 				// checks if item id is in double digits
			itemNo = addedKeys[i].key.subString(7,9); 			// item id = double digits
		} else {
			itemNo = addedKeys[i].key.charAt(7);				// itemNo is single digit
		}
		if (addedKeys[i].key.indexOf("listID") !== -1){	
			console.log(addedKeys[i].key);
			console.log(" found at " + addedKeys[i].key.indexOf("listID" !== -1));												
		} else {
		addListItem(itemNo);
		};
	};
	console.log("check");	
	};
	
	};


	function updateListRefrences(start){
	var noItems, i;
		noItems = gapi.hangout.data.getValue("listTxt") || "0";
		for (i = NoItems; i >= start; i--) {
			var delBut, addBut, delIDBut, addIDBut, txtIn, j ,idListLength;
			delBut = document.getElementsByName("delBut" + i);
			delBut.name = "delBut" + (i + 1);
			addBut = document.getElementsByName("addBut" + i);
			addBut.name = "addBut" + (i + 1);
			delIDBut = document.getElementsByName("delIDBut" + i);
			delIDBut.name = "delIDBut" + (i + 1);
			addIDBut = document.getElementsByName("addIDBut" + i);
			addIDBut.name = "addIDBut" + (i + 1);
			txtIn = document.getElementsByName("txtIn" + i);
			txtIn.name = "txtIn" + (i + 1);	
			txtIn.value = gapi.hangout.data.getValue("listTxt" + (i + 1));
			
			idListLength = gapi.hangout.data.getValue("listTxt" + i + "listID");
			for (j = 1; j <= idListLength; j++) {
				var userPic = document.getElementsByName("listTxt" + i + "listID" + j);
				userPic.name = "listTxt" + (i + 1) + "listID" + j;
			};
		};
	};
		
	
	function addListItem (itemNo){
	var div, i, li, li2, e1, e2, userID;
	console.log("New list item print");
		div = document.getElementById(tableId);
		//i = gapi.hangout.data.getValue("listTxt") || "0";			// get list Length
		i = itemNo;
		updateListRefrences(itemNo);
		userID =  gapi.hangout.getLocalParticipantId();
		li = div.insertRow(pos);								// Create new element to attach
		console.log("add line1");
			e1 = li.instertCell(0);
			e1.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			e1.appendChild(addDelButton(i));							// add delete button
			e1.appendChild(addAddButton(i));							// add Add button
		console.log("add line2");										
		li2 = div.insertRow(pos);
			e2 = li2.instertCell(0);
			e2.appendChild(addIDAddButton(userID,i));					// add Add user sing button
			e2.appendChild(addIDDelButton(userID,i));					// add Remove user sign button 	
			console.log("New list item print Complete");
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
				removeItemFromSharedList("listTxt",delBut.name.subString(6));
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
			findAndRemoveItemFromSharedList("listTxt" + delIDBut.name.subString(8) + "listID",userID);
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
			findAndAddNewItemToSharedList("listTxt" + addIDBut.name.subString(8) + "listID",userID);
		}; 
		return addIDBut;										// return button element
	};
	
	
	// add text input bar
	function addTxtInput(itemNo) { 
		var txtIn = document.createElement("input"); 					// create input element
		txtIn.name = "txtIn" + itemNo;
		txtIn.type = "text";											// of text type
		txtIn.size = "32";
		//txtIn.className = "css-class-name";							// set style will be implimented later
		txtIn.value = gapi.hangout.data.getValue("listTxt" + itemNo); 	// value = state value text
		txtIn.onchange = function() { 									// updates shared value with enterd txt
				gapi.hangout.data.setValue("listTxt" + txtIn.name.subString(5), txtIn.value); 
		}; 		
		return txtIn;													// return txtInput element
	};
	
	// add Add ID pic
	function userPicture(itemNo,idLoc) { 														
		var userPic = document.createElement("img");											// create element
		var userID = gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + idLoc) || "0"; 	// Get Persons ID
		console.log("3  " + userID);
		var userObj = eval(gapi.hangout.getParticipantById(userID));							// Get person object and JSON convert
		userPic.name = "listTxt" + itemNo + "listID" + idLoc;
		userPic.src = userObj.person.image.url + "sz=25";										// Use Avatar as image (+ resize to 50x50)
		console.log("4");
		userPic.width = 25;
		userPic.height = 25;
		userPic.align = "top"; 
		return userPic;																			// return button element
	};
	
	
		
  var Lister = new Lister();	
}(window));