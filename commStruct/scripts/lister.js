(function (window) {	
  	
  function Lister() {	
    console.log("Starting Lister");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  
  //-------------------- VARS -------------------------	
  
  var tableId;	// holds the id of the main lister Table for refrenceing
  
  
  //-------------------- Listeners -------------------------
	
	// script start and loop
	Lister.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {	
			console.log("Lister Ready");	
			
	
		gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {				// add callback event for list change
		add(stateChangeEvent.addedKeys,stateChangeEvent.removedKeys);
		});
		//this.displayListItems();
		listerTableSetup();
		}	
	};	
  
  //-------------------- Functions -------------------------
  
	//inital table setup and item
	function listerTableSetup(){
		console.log("setup table start");
		var div, tb;
		div = document.getElementById("lister");				// get element
		div.innerHTML = "";									// clear exsisitn displayed list
		
		tb = document.createElement("table");
		tb.id = "mainListerTable";
		tableId = tb.id;
		tb.insertRow(0);										// stores the table refrence
		div.appendChild(tb);								// add new List to HTML element
		console.log("table added");
		addNewItemToSharedList ("listTxt","1");
		console.log("blank added");
	};
	
	
	/* function to orginise state update and call relivent functions
		addedKeys - a list of added key pairs
		removedKeys - a list of removed key pairs */
	function add (addedKeys,removedKeys){
		var itemNo, div;
		console.log("state changer start");
		div = document.getElementById(tableId);
		if(div.rows.length < (2 * parseInt(gapi.hangout.data.getValue("listTxt"),10)) + 1){ // check for ligitimate additions
			for (var i = 0; i < addedKeys.length ; i++ ){				// for all the added keys
				if (addedKeys[i].key.indexOf("listTxt") !== -1){			// checks add change is relivent lister items			
					if (addedKeys[i].key.length == 9) {						// if key name is 9 long then must havde double digit itemNo
						itemNo = addedKeys[i].key.substring(7,9); 				// item id = double digits
						addListItem(itemNo);									// add to table
					} else if (addedKeys[i].key.length == 8) {				// 	if key name is 8 long then must havde single digit itemNo
						itemNo = addedKeys[i].key.charAt(7);					// itemNo is single digit
						addListItem(itemNo);									// add to table
					};
				};		
			};		
		};
		if (addedKeys[i].key.indexOf("listID") !== -1){	// if list id found then if refrencing a new user ID added to list element
			console.log(addedKeys[i].key);
			console.log(" found at " + addedKeys[i].key.indexOf("listID" !== -1));												
		};
		console.log("added check done");
		if(div.rows.length > (2 * parseInt(gapi.hangout.data.getValue("listTxt"),10)) + 1){ // check for ligitimate removals
			for (var i = 0; i < removedKeys.length ; i++ ){				// for all the added keys		
				if (removedKeys[i].indexOf("listTxt") !== -1){			// checks add change is relivent lister items
					console.log("true for txt val");
					if (removedKeys[i].length == 9) {						// if name is 9 long then must havde double digit itemNo
						itemNo = removedKeys[i].substring(7,9); 				// item id = double digits
						removeListItem(itemNo);									// add to table
					} else if (removedKeys[i].length == 8) {				// 	if name is 8 long then must havde single digit itemNo
						itemNo = removedKeys[i].charAt(7);					// itemNo is single digit
						console.log("begin remove");
						removeListItem(itemNo);									// add to table
					};
				console.log("removeer check done");
				};	
			};
			console.log("removed check done");
		};
		if (removedKeys[i].indexOf("listID") !== -1){	// if list id found then if refrencing a new user ID added to list element
			console.log(removedKeys[i]);
			console.log(" found at " + removedKeys[i].indexOf("listID" !== -1));												
		};
	};
	

	/* updates the list object elements to adjust there position due to insterted table lines
		start - the location of the new line */
	function updateListRefrences(i,j){
			var delBut, addBut, delIDBut, addIDBut, txtIn, k ,idListLength;
			//console.log("del");
			delBut = document.getElementsByName("delBut" + i);				// get element by name
			delBut.name = "delBut" + j;										// rename as "name"idNo + 1
			//console.log("del name = " + delBut.name);
			addBut = document.getElementsByName("addBut" + i);
			addBut.name = "addBut" + j;
			delIDBut = document.getElementsByName("delIDBut" + i);
			delIDBut.name = "delIDBut" + j;
			addIDBut = document.getElementsByName("addIDBut" + i);
			addIDBut.name = "addIDBut" + j;
			txtIn = document.getElementsByName("txtIn" + i);
			txtIn.name = "txtIn" + j;	
			txtIn.value = gapi.hangout.data.getValue("listTxt" + j);		
			console.log("do image loop");
			idListLength = gapi.hangout.data.getValue("listTxt" + i + "listID");
			for (k = 1; k <= idListLength; k++) {									// for all ID pics in list line, imcriment name refrence by 1
				var userPic = document.getElementsByName("listTxt" + i + "listID" + k);
				userPic.name = "listTxt" + j + "listID" + k;
			};
		};

	/* runs through all affected list element components and renames them to suit new position
	 - removed : element to stop at */
	function updateListRefrencesDelete(removed){
	var noItems, i, j;
		noItems = gapi.hangout.data.getValue("listTxt") || "0";
		j = (parseInt(noItems) - 1).toString();
		for (i = noItems; i > removed; i--) {								// for all list lines, imcriment name refrence by 1
			updateListRefrences(i,j);
			j--;
		};
		console.log("update refrences done");
	};
	
	/* adds list element to the display table
		itemNo - the item to start displaying	*/
	function updateListRefrencesAdd(start){
		var noItems, i, j;
		noItems = gapi.hangout.data.getValue("listTxt") || "0";
		j = (parseInt(noItems) + 1).toString();
		for (i = noItems; i >= start; i--) {								// for all list lines, imcriment name refrence by 1
			updateListRefrences(i,j);
			j--;
		};
		console.log("update refrences done");
	};
		
	/* removes a list element from the display table
		itemNo - the item to stop displaying	*/
	function removeListItem(itemNo){
		var i;
		updateListRefrencesDelete(itemNo);
		div = document.getElementById(tableId);
		i = ((2 * parseInt(itemNo)) - 1).toString();					// use (2N - 1) to select tabe line corectly
		div.deleteRow(i);
		div.deleteRow(i);												// deletes second row contating ID list which is now at pos i
	};	
		
	/* Adds a new table row for a new list item
	itemNo - the location in the list to add too */
	function addListItem (itemNo){
	var div, i, li, li2, e1, e2, userID, j;
	console.log("New list item print");
		div = document.getElementById(tableId);							// get table ref
		console.log("table found id = " + tableId + " and equals " + div);
		i = itemNo;
		console.log("call refrence update");
		updateListRefrencesAdd(itemNo);
		userID =  gapi.hangout.getLocalParticipantId();
		
		j = ((2 * parseInt(itemNo)) - 1).toString();					// use (2N - 1) to selest tabe line corectly
		console.log("start adding rows " + j);
		li = div.insertRow(j);								// Create new element to attach
		console.log("add line1");
			e1 = li.insertCell(0);
			e1.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			e1.appendChild(addDelButton(i));							// add delete button
			e1.appendChild(addAddButton(i));							// add Add button
		console.log("add line2");	
			j++;														// set to add below just added line
		li2 = div.insertRow(j);
			e2 = li2.insertCell(0);
			e2.appendChild(addIDAddButton(userID,i));					// add Add user sign button
			e2.appendChild(addIDDelButton(userID,i));					// add Remove user sign button 	
			//console.log("New list item print Complete");
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
				console.log("Delete Press " + delBut.name);
				removeItemFromSharedList("listTxt",delBut.name.substring(6));
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
				console.log("Add Press " + addBut.name);
				var j = (parseInt(addBut.name.substring(6)) + 1);
				console.log(j);
				addNewItemToSharedList ("listTxt",j); 					// adds blank list element below selected element
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
			findAndRemoveItemFromSharedList("listTxt" + delIDBut.name.substring(8) + "listID",userID);
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
			findAndAddNewItemToSharedList("listTxt" + addIDBut.name.substring(8) + "listID",userID);
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
				gapi.hangout.data.setValue("listTxt" + txtIn.name.substring(5), txtIn.value); 
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