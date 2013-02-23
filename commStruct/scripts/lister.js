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
		
		//if (!!gapi.hangout.data.getValue("lastListItemAdded")){ gapi.hangout.data.setValue("lastListItemAdded", "1");};
		
		//this.displayListItems();
		if (!!gapi.hangout.data.getValue("listTxt")){ 
			listerTableSetupExsisting();
		} else { 
			listerTableSetup();
		};
		}	
	};	
  
  //-------------------- Functions -------------------------
  
	//inital table setup and item
	function listerTableSetup(){
		console.log("setup new table start");
		var div, tb;
		div = document.getElementById("lister");				// get element
		div.innerHTML = "";									// clear exsisitn displayed list
		
		tb = document.createElement("table");
		tb.id = "mainListerTable";
		tableId = tb.id;
		tb.insertRow(0);										// stores the table refrence
		div.appendChild(tb);
		gapi.hangout.data.setValue("lastListItemAdded", "0"); 
		addNewItemToSharedList ("listTxt",1);
		console.log("blank added");
	};
	
	function listerTableSetupExsisting(){
	var div,li, li2, e1, e2, tb;
		console.log("build table of exsisting list items");
		div = document.getElementById("lister");				// get element
		div.innerHTML = "";									// clear exsisitn displayed list
		tb = document.createElement("table");
		userID =  gapi.hangout.getLocalParticipantId();
		for (i = 1; i <= gapi.hangout.data.getValue("listTxt"); i++) { 
			li = div.insertRow(-1);								// Create new element to attach
				e1 = li.insertCell(0);
				e1.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
				e1.appendChild(addDelButton(i));							// add delete button
				e1.appendChild(addAddButton(i));							// add Add button														
			li2 = div.insertRow(-1);
				e2 = li2.insertCell(0);
				e2.appendChild(addIDAddButton(userID,i));					// add Add user sign button
				e2.appendChild(addIDDelButton(userID,i));
		}
		div.appendChild(tb);
	}
	
	/* function to orginise state update and call relivent functions
		addedKeys - a list of added key pairs
		removedKeys - a list of removed key pairs */
	function add (addedKeys,removedKeys){
		var itemNo, div;
		console.log("state changer start ");
		div = document.getElementById(tableId);
		if (addedKeys.length != 0){
		if(div.rows.length < (2 * parseInt(gapi.hangout.data.getValue("listTxt"),10)) + 1){ // check for ligitimate additions
			for (var i = 0; i < addedKeys.length ; i++ ){				// for all the added keys
				if (addedKeys[i].key.indexOf("listTxt") !== -1){			// checks add change is relivent lister items			
					if (addedKeys[i].key.length == 9) {						// if key name is 9 long then must havde double digit itemNo
						itemNo = addedKeys[i].key.substring(7,9); 				// item id = double digits
						addListItem(itemNo);									// add to table
					} else if (addedKeys[i].key.length == 8) {				// 	if key name is 8 long then must havde single digit itemNo
						itemNo = addedKeys[i].key.charAt(7);					// itemNo is single digit
						console.log("adding normal list " + itemNo)
						addListItem(itemNo);									// add to table
					}
				};		
			};		
		};
		if (addedKeys[i].key.indexOf("listID") !== -1){	// if list id found then if refrencing a new user ID added to list element
						console.log(addedKeys[i].key);
						console.log(" found at " + addedKeys[i].key.indexOf("listID" !== -1));												
					};
		
		};
		//console.log("added check done");
		if(!!removedKeys.length != 0){
		//console.log("removedkeys check start true");
		
		//console.log("added check done");
		if(div.rows.length > (2 * parseInt(gapi.hangout.data.getValue("listTxt"),10))){ // check for ligitimate removals
			//console.log("remove length true = " + removedKeys[0] + " and length " + removedKeys.length);
			
			for (var i = 0; i < removedKeys.length ; i++ ){				// for all the added keys	
				if (removedKeys[i].indexOf("listTxt") !== -1){			// checks add change is relivent lister items
					if (removedKeys[i].length == 9) {						// if name is 9 long then must havde double digit itemNo
						itemNo = removedKeys[i].substring(7,9); 				// item id = double digits
						removeListItem(itemNo);									// add to table
					} else if (removedKeys[i].length == 8) {				// 	if name is 8 long then must havde single digit itemNo
						//itemNo = removedKeys[i].charAt(7);					// itemNo is single digit
						itemNo = gapi.hangout.data.getValue("lastListItemDeleted");
						console.log("begin remove of " + itemNo);
						
						removeListItem(itemNo);									// add to table
					}
				//console.log("removeer check done");
				};	
			};
			//console.log("removed check done");
		};
		
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
			console.log("re structure " + i + " " + j);
			delBut = document.getElementById("delBut" + i);				// get element by name
			console.log(" looking for  " + i + " but found " + delBut);
			delBut.id = "delBut" + j;										// rename as "name"idNo + 1
			console.log("delBut" + i  + " new name = " + delBut.id);
			console.log("1");
			addBut = document.getElementById("addBut" + i);
			addBut.id = "addBut" + j;
			delIDBut = document.getElementById("delIDBut" + i);
			console.log("2");
			delIDBut.id = "delIDBut" + j;
			addIDBut = document.getElementById("addIDBut" + i);
			addIDBut.id = "addIDBut" + j;
			txtIn = document.getElementById("txtIn" + i);
			txtIn.id = "txtIn" + j;	
			console.log( "txtIn id from " + i + " to " + j + " with val " + txtIn.value + " to " +  gapi.hangout.data.getValue("listTxt" + j));
			txtIn.value = gapi.hangout.data.getValue("listTxt" + j);		
			console.log("do image loop");
			idListLength = gapi.hangout.data.getValue("listTxt" + i + "listID");
			for (k = 1; k <= idListLength; k++) {									// for all ID pics in list line, imcriment name refrence by 1
				var userPic = document.getElementById("listTxt" + i + "listID" + k);
				userPic.id = "listTxt" + j + "listID" + k;
			};
		};

	/* runs through all affected list element components and renames them to suit new position
	 - removed : element to stop at */
	function updateListRefrencesDelete(removed){
	var noItems, i, j;
		noItems = gapi.hangout.data.getValue("listTxt") || "0";
		j = (parseInt(noItems) - 1).toString();
		for (i = (parseInt(noItems)).toString(); i > removed; i--) {								// for all list lines, imcriment name refrence by 1
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
		j = (parseInt(noItems)).toString();
		console.log(" loop info " + noItems + " " + j);
		for (i = (parseInt(noItems) - 1).toString(); i > (start); i--) {								// for all list lines, imcriment name refrence by 1
			updateListRefrences(i,j);
			j--;
		};
		console.log("update refrences done");
	};
		
	/* removes a list element from the display table
		itemNo - the item to stop displaying	*/
	function removeListItem(itemNo){
		var i;
		console.log( "updating i = " + itemNo);
		updateListRefrencesDelete(itemNo);
		div = document.getElementById(tableId);
		i = ((2 * parseInt(itemNo)) - 1).toString();					// use (2N - 1) to select tabe line corectly
		console.log(" delete row " + i);
		div.deleteRow(i);
		div.deleteRow(i);												// deletes second row contating ID list which is now at pos i
	};	
		
	/* Adds a new table row for a new list item
	itemNo - the location in the list to add too */
	function addListItem (itemNo){
	var div, i, li, li2, e1, e2, userID, j;
	console.log("New list item print");
		itemNo = gapi.hangout.data.getValue("lastListItemAdded");
		console.log("call refrence update " + gapi.hangout.data.getValue("lastListItemAdded"));
		div = document.getElementById(tableId);							// get table ref
		i = (parseInt(itemNo) + 1).toString();
		
		updateListRefrencesAdd(itemNo);
		userID =  gapi.hangout.getLocalParticipantId();
		
		j = ((2 * parseInt(i)) - 1).toString();					// use (2N - 1) to selest tabe line corectly
		console.log("start adding rows " + i);
		li = div.insertRow(j);								// Create new element to attach
			e1 = li.insertCell(0);
			e1.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			e1.appendChild(addDelButton(i));							// add delete button
			e1.appendChild(addAddButton(i));							// add Add button
			j++;														// set to add below just added line
		li2 = div.insertRow(j);
			e2 = li2.insertCell(0);
			e2.appendChild(addIDAddButton(userID,i));					// add Add user sign button
			e2.appendChild(addIDDelButton(userID,i));					// add Remove user sign button 	
			//console.log("New list item print Complete");
			console.log("add line done");
	};

	
//-------------------- Button creation -------------------------
	
	// add Delete list item button
	function addDelButton(itemNo) { 								// itemNo targets specific list item
		var delBut = document.createElement("img");					// create element
		delBut.id = "delBut" + itemNo;							// fill in element details
		delBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		delBut.width = 25;
		delBut.height = 25;
		delBut.align = "top";
		delBut.onclick = function() { 								// on click calls remove function with param targeting the specific line
				console.log("Delete Press " + delBut.id);
				gapi.hangout.data.setValue("lastListItemDeleted", delBut.id.substring(6));
				removeItemFromSharedList("listTxt",delBut.id.substring(6));
		}; 
		return delBut;												// return button element
	};
	
	// add Add list item button name
	function addAddButton(itemNo) { 									// itemNo targets specific list item
		var addBut = document.createElement("img");						// create element
		addBut.id = "addBut" + itemNo;								// fill in element details
		addBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/addBtn.jpg";
		addBut.width = 25;
		addBut.height = 25;
		addBut.align = "top";
		addBut.onclick = function() { 									// on click calls remove function with param targeting the specific line
				console.log("Add Press " + addBut.id);
				gapi.hangout.data.setValue("lastListItemAdded", addBut.id.substring(6)); 
				console.log("Add last affected " + addBut.id.substring(6));
				addNewItemToSharedList ("listTxt",(parseInt(addBut.id.substring(6)) + 1)); 					// adds blank list element below selected element
		}; 
		return addBut;													// return button element
	};
	
	// add Delete ID list item button
	function addIDDelButton(userID,itemNo) { 						// itemNo targets specific list item
		var delIDBut = document.createElement("img");				// create element
		delIDBut.id = "delIDBut" + itemNo;						// fill in element details
		delIDBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		delIDBut.width = 25;
		delIDBut.height = 25;
		delIDBut.align = "top";
		delIDBut.onclick = function() { 							// on click calls remove function with param targeting the specific line
			console.log("Del ID Press");
			findAndRemoveItemFromSharedList("listTxt" + delIDBut.id.substring(8) + "listID",userID);
		}; 
		return delIDBut;											// return button element
	};
	
	// add Add ID list item button
	function addIDAddButton(userID,itemNo) { 					// itemNo targets specific list item
		var addIDBut = document.createElement("img");			// create element
		addIDBut.id = "addIDBut" + itemNo;					// fill in element details
		addIDBut.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/addBtn.jpg";
		addIDBut.width = 25;
		addIDBut.height = 25;
		addIDBut.align = "top";
		addIDBut.onclick = function() { 						// on click calls remove function with param targeting the specific line
			console.log("Add ID press");
			findAndAddNewItemToSharedList("listTxt" + addIDBut.id.substring(8) + "listID",userID);
		}; 
		return addIDBut;										// return button element
	};
	
	
	// add text input bar
	function addTxtInput(itemNo) { 
		var txtIn = document.createElement("input"); 					// create input element
		txtIn.id = "txtIn" + itemNo;
		txtIn.type = "text";											// of text type
		txtIn.size = "32";
		//txtIn.className = "css-class-name";							// set style will be implimented later
		txtIn.value = gapi.hangout.data.getValue("listTxt" + itemNo); 	// value = state value text
		txtIn.onchange = function() { 									// updates shared value with enterd txt
				gapi.hangout.data.setValue("listTxt" + txtIn.id.substring(5), txtIn.value); 
		}; 		
		return txtIn;													// return txtInput element
	};
	
	// add Add ID pic
	function userPicture(itemNo,idLoc) { 														
		var userPic = document.createElement("img");											// create element
		var userID = gapi.hangout.data.getValue("listTxt" + itemNo + "listID" + idLoc) || "0"; 	// Get Persons ID
		console.log("3  " + userID);
		var userObj = eval(gapi.hangout.getParticipantById(userID));							// Get person object and JSON convert
		userPic.id = "listTxt" + itemNo + "listID" + idLoc;
		userPic.src = userObj.person.image.url + "sz=25";										// Use Avatar as image (+ resize to 50x50)
		console.log("4");
		userPic.width = 25;
		userPic.height = 25;
		userPic.align = "top"; 
		return userPic;																			// return button element
	};
	
	
		
  var Lister = new Lister();	
}(window));