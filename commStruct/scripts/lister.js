(function (window) {	
  	
  function Lister() {	
    console.log("Starting Lister");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	// Add callback
  }	
  
  //-------------------- VARS -------------------------	
  
  var tableId;	// holds the id of the main lister Table for refrenceing
  var addImg; 			//  Stores addImage node for cloneing on list
  var removeImg; 			//  Stores deleteImage node for cloneing on list
  var currentHighlightItem; // stores the item number that uis currently highlighted in the list
  
  //-------------------- Listeners -------------------------
	
	// script start and loop
	Lister.prototype.onApiReady = function (event) {	
		if (event.isApiReady === true) {	
			console.log("Lister Startup");	
			
	
		gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {				// add callback event for list change
		updateCheckerLister(stateChangeEvent.addedKeys,stateChangeEvent.removedKeys);
		});
		
		imagePreload();
		currentHighlightItem = "0";
		//this.displayListItems();
		if (!!gapi.hangout.data.getValue("listTxt")){ 
			listerTableSetupExsisting();
		} else { 
			gapi.hangout.data.setValue("currentHighlightedItem","0");
			listerTableSetup();
		};
		
		console.log("Lister Ready");
		}			
	};	
  
  //-------------------------------------------- Setup -------------------------------------------------------
  
	//inital table setup and item
	function listerTableSetup(){
		console.log("setup new table start");
		var div, tb, li;
		div = document.getElementById("lister");				// get element
		div.innerHTML = "";									// clear exsisitn displayed list
		
		tb = document.createElement("table");
		tb.id = "mainListerTable";
		tableId = tb.id;
		li = tb.insertRow(0);										// stores the table refrence
		li.innetHTML = "hi";
		div.appendChild(tb);
		//console.log("length = " + tb.rows.length);
		gapi.hangout.data.setValue("lastListItemAdded", "0"); 
		addNewItemToSharedList ("listTxt",1);
	};
	
	// displays list table is app data already exsists
	function listerTableSetupExsisting(){
	var div, li, li2, e1, e2, tb, i, j, k, idListLength;
		console.log("build table of exsisting list items");
		div = document.getElementById("lister");				// get element
		div.innerHTML = "";									// clear exsisitn displayed list
		tb = document.createElement("table");
		tb.id = "mainListerTable";
		tableId = tb.id;
		tb.insertRow(0);
		for (i = 1; i <= gapi.hangout.data.getValue("listTxt"); i++) { 
			j = ((2 * parseInt(i)) - 1).toString();
			li = tb.insertRow(j);								// Create new element to attach
				e1 = li.insertCell(0);
				e1.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
				e1.appendChild(addDelButton(i));							// add delete button
				e1.appendChild(addAddButton(i));							// add Add button	
				j++;
			li2 = tb.insertRow(j);

				e2 = li2.insertCell(0);
				e2.appendChild(addIDAddButton(i));					// add Add user sign button
				e2.appendChild(addIDDelButton(i));
				idListLength = gapi.hangout.data.getValue("listTxt" + i + "listID");
				for (k = 1; k <= idListLength; k++) {									// for all ID pics in list line, imcriment name refrence by 1
					e2.appendChild(userPicture(i,k));
				};
		}
		div.appendChild(tb);
		if (gapi.hangout.data.getValue("currentHighlightedItem") != "0"){				// highlight if needed.
			highlightListItem(gapi.hangout.data.getValue("currentHighlightedItem"));
		};
	};
	// this function pre-creates the add and remove buttons so images are not missing on load.
	function imagePreload(){
		addImg = document.createElement("img");						// create element
		addImg .src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/addBtn.jpg";
		addImg.width = 25;
		addImg.height = 25;
		addImg.align = "top";
		removeImg = document.createElement("img");						// create element
		removeImg.src = "https://raw.github.com/WhatTheFunkNGC/colabhang/master/lister/img/deleteBtn.jpg";
		removeImg.width = 25;
		removeImg.height = 25;
		removeImg.align = "top";
	};
	
	//-------------------------------------------- Functions -------------------------------------------------------
	
	
	/* function to orginise state update and call relivent functions
		addedKeys - a list of added key pairs
		removedKeys - a list of removed key pairs */
	function updateCheckerLister (addedKeys,removedKeys){
		var itemNo, div;
		div = document.getElementById(tableId);
		if (addedKeys.length != 0){
		 // check for ligitimate additions
			for (var i = 0; i < addedKeys.length ; i++ ){				// for all the added keys
				if(div.rows.length < (2 * parseInt(gapi.hangout.data.getValue("listTxt"),10)) + 1){
					if ((addedKeys[i].key.indexOf("listTxt") !== -1 ) && (addedKeys[i].key.indexOf("listID") == -1)){			// checks add change is relivent lister items	
						var re1='.*?';	// Non-greedy match on filler
						var re2='(\\d+)';	// Integer Number 1
						var p = new RegExp(re1+re2,["i"]);
						var m = p.exec(addedKeys[i].key);										
						if (m != null){
							itemNo = m[1];
							//console.log("imtem No is " + itemNo);	
							console.log("adding found");						
							addListItem(itemNo);
						};	
					};
				};
				if (addedKeys[i].key.indexOf("listID") !== -1){	// if list id found then if refrencing a new user ID added to list element
					//console.log("ADD ID FOUND = " + addedKeys[i].key + " " + addedKeys[i].value);
					var re1='.*?';	// Non-greedy match on filler
					var re2='(\\d+)';	// Integer Number 1
					var p = new RegExp(re1+re2,["i"]);
					var m = p.exec(addedKeys[i].key);		
					if (addedKeys[i].value.indexOf("hangout") !== -1){
						itemNo = m[1];
						//console.log("imtem No is " + itemNo);					
						updateIDlistDisplay(itemNo);
					};											
				};
				if (addedKeys[i].key == "currentHighlightedItem"){
					scrollHighlightChange();
				};
			};
		};
		//console.log("now checking removd ");
		if(!!removedKeys.length != 0){
			for (var i = 0; i < removedKeys.length ; i++ ){				// for all the added keys		
				if(div.rows.length > (2 * parseInt(gapi.hangout.data.getValue("listTxt"),10))){
					if ((removedKeys[i].indexOf("listTxt") !== -1) && (removedKeys[i].indexOf("listID") == -1)){			// checks add change is relivent lister items
						var re1='.*?';	// Non-greedy match on filler
						var re2='(\\d+)';	// Integer Number 1
						var p = new RegExp(re1+re2,["i"]);
						var m = p.exec(removedKeys[i]);		
						if (m != null){
							itemNo = m[1];				
							removeListItem(itemNo);
						};				
					};
				};
				if (removedKeys[i].indexOf("listID") !== -1){	// if list id found then if refrencing a new user ID added to list element
					//console.log("REMOVE ID FOUND");
					var re1='.*?';	// Non-greedy match on filler
					var re2='(\\d+)';	// Integer Number 1
					var p = new RegExp(re1+re2,["i"]);
					var m = p.exec(removedKeys[i]);		
					if (m[1] != 0){
						itemNo = m[1];				
						updateIDlistDisplay(itemNo);
					};				
				};				
			};
			//console.log("removed check done");
		};
	};
	
	// updates the User pictre list of an item to reflect additions or removals
	function updateIDlistDisplay(itemNo){
		var div, i, li, e1, rowNum,idListLength;
		div = document.getElementById("mainListerTable");				// get element
		rowNum = ((2 * parseInt(itemNo))).toString();
		console.log(" div  = " + div.rows.length + " " + rowNum);
		li = div.rows[rowNum];
		//li.innerHTML = "";
		li.removeChild(li.childNodes[0]);
			e1 = li.insertCell(0);
			e1.appendChild(addIDAddButton(itemNo));					// add Add user sign button
			e1.appendChild(addIDDelButton(itemNo));
		idListLength = gapi.hangout.data.getValue("listTxt" + itemNo + "listID");
		console.log("and we have " + idListLength);
		for (i = 1; i <= idListLength; i++) {									// for all ID pics in list line, imcriment name refrence by 1
				e1.appendChild(userPicture(itemNo,i));
		};
	};
		
	/* removes a list element from the display table
		itemNo - the item to stop displaying	*/
	function removeListItem(itemNo){
		var i;
		//console.log( "REMOVING ROW updating i = " + itemNo);
		itemNo = gapi.hangout.data.getValue("lastListItemDeleted");
		updateListRefrencesDelete(itemNo);
		div = document.getElementById(tableId);
		i = ((2 * parseInt(itemNo)) - 1).toString();					// use (2N - 1) to select tabe line corectly
		//console.log(" delete row " + i);
		div.deleteRow(i);
		div.deleteRow(i);												// deletes second row contating ID list which is now at pos i
		//console.log("local : " + currentHighlightItem + " server side : " + gapi.hangout.data.getValue("currentHighlightedItem"));
		var newHighlight = (parseInt(gapi.hangout.data.getValue("currentHighlightedItem")) - 1).toString();
		currentHighlightItem = (parseInt(currentHighlightItem)- 1).toString();
		gapi.hangout.data.setValue("currentHighlightedItem",newHighlight);
	};	
		
	/* Adds a new table row for a new list item
	itemNo - the location in the list to add too */
	function addListItem (itemNo){
	var div, i, li, li2, e1, e2, j;
	//console.log("New list item print");
		itemNo = gapi.hangout.data.getValue("lastListItemAdded");
		//console.log("call refrence update " + gapi.hangout.data.getValue("lastListItemAdded"));
		div = document.getElementById(tableId);							// get table ref
		i = (parseInt(itemNo) + 1).toString();
		
		updateListRefrencesAdd(itemNo);
		
		j = ((2 * parseInt(i)) - 1).toString();					// use (2N - 1) to selest tabe line corectly
		//console.log("start adding rows " + i);
		li = div.insertRow(j);								// Create new element to attach
			e1 = li.insertCell(0);
			e1.appendChild(addTxtInput(i));								// Adds txtInput item (containing list value)
			e1.appendChild(addDelButton(i));							// add delete button
			e1.appendChild(addAddButton(i));							// add Add button
			j++;														// set to add below just added line
		li2 = div.insertRow(j);
			e2 = li2.insertCell(0);
			e2.appendChild(addIDAddButton(i));					// add Add user sign button
			e2.appendChild(addIDDelButton(i));					// add Remove user sign button 	
			//console.log("New list item print Complete");
			if(gapi.hangout.data.getValue("currentHighlightedItem") != "0"){
				//console.log("local : " + currentHighlightItem + " server side : " + gapi.hangout.data.getValue("currentHighlightedItem"));
				var newHighlight = (parseInt(gapi.hangout.data.getValue("currentHighlightedItem")) + 1).toString();
				gapi.hangout.data.setValue("currentHighlightedItem",newHighlight);
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
		//console.log(" loop info " + noItems + " " + j);
		for (i = (parseInt(noItems) - 1).toString(); i > (start); i--) {								// for all list lines, imcriment name refrence by 1
			updateListRefrences(i,j);
			j--;
		};
		//console.log("update refrences done");
	};
	
	/* updates the list object elements to adjust there position due to insterted table lines
		start - the location of the new line */
	function updateListRefrences(i,j){
			var delBut, addBut, delIDBut, addIDBut, txtIn, k ,idListLength;
			//console.log("re structure " + i + " " + j);
			delBut = document.getElementById("delBut" + i);				// get element by name
			//console.log(" looking for  " + i + " but found " + delBut);
			delBut.id = "delBut" + j;										// rename as "name"idNo + 1
			//console.log("delBut" + i  + " new name = " + delBut.id);
			//console.log("1");
			addBut = document.getElementById("addBut" + i);
			addBut.id = "addBut" + j;
			delIDBut = document.getElementById("delIDBut" + i);
			console.log("2");
			delIDBut.id = "delIDBut" + j;
			addIDBut = document.getElementById("addIDBut" + i);
			addIDBut.id = "addIDBut" + j;
			txtIn = document.getElementById("txtIn" + i);
			txtIn.id = "txtIn" + j;	
			//console.log( "txtIn id from " + i + " to " + j + " with val " + txtIn.value + " to " +  gapi.hangout.data.getValue("listTxt" + j));
			txtIn.value = gapi.hangout.data.getValue("listTxt" + j);		
			//console.log("do image loop");
			idListLength = gapi.hangout.data.getValue("listTxt" + i + "listID");
			for (k = 1; k <= idListLength; k++) {									// for all ID pics in list line, imcriment name refrence by 1
				var userPic = document.getElementById("listTxt" + i + "listID" + k);
				userPic.id = "listTxt" + j + "listID" + k;
			};
		};
		
	// moves the highlight up from the items
	function scrollHighlightChange(){
		unHighlightListItem(currentHighlightItem);
		highlightListItem(gapi.hangout.data.getValue("currentHighlightedItem"));
		currentHighlightItem = gapi.hangout.data.getValue("currentHighlightedItem");
	};
	
	function unHighlightListItem(itemNo){
	var div, rowNum;
		if (itemNo != "0"){
		console.log("item No  = " + itemNo);
			rowNum = (2 * parseInt(itemNo)) - 1;
			div = document.getElementById(tableId);			
			console.log("is more transparent");
			div.rows[rowNum].style.backgroundColor = "transparent";
			div.rows[rowNum + 1].style.backgroundColor = "transparent";
		};
	};
	
	/* toggles if a selected List item is highlighted */
	function highlightListItem(itemNo){
		var div, rowNum;
		if ((itemNo != "0") || (!itemNo) ){
			rowNum = (2 * parseInt(itemNo)) - 1;
			div = document.getElementById(tableId);			
			div.rows[rowNum].style.backgroundColor="#F8ED69";
			div.rows[rowNum + 1].style.backgroundColor="#F8ED69";
		};
	};
	
	
	
	

	
//-------------------- Button creation -------------------------
	
	// add Delete list item button
	function addDelButton(itemNo) { 								// itemNo targets specific list item
		var delBut = removeImg.cloneNode();						// create element
		delBut.id = "delBut" + itemNo;							// fill in element details
		delBut.onclick = function() { 								// on click calls remove function with param targeting the specific line
				console.log("Delete Press " + delBut.id);
				gapi.hangout.data.setValue("lastListItemDeleted", delBut.id.substring(6));
				removeItemFromSharedList("listTxt",delBut.id.substring(6));
				if ( gapi.hangout.data.getValue("listTxt") == "0"){ 			// checks if no list items left and adds a new one if true
					gapi.hangout.data.setValue("lastListItemAdded", "0"); 
					addNewItemToSharedList ("listTxt",1);
				};
		}; 
		return delBut;												// return button element
	};
	
	// add Add list item button name
	function addAddButton(itemNo) { 									// itemNo targets specific list item
		var addBut = addImg.cloneNode();
		addBut.id = "addBut" + itemNo;								// fill in element details
		addBut.onclick = function() { 									// on click calls remove function with param targeting the specific line
				console.log("Add Press " + addBut.id);
				gapi.hangout.data.setValue("lastListItemAdded", addBut.id.substring(6)); 
				console.log("Add last affected " + addBut.id.substring(6));
				addNewItemToSharedList ("listTxt",(parseInt(addBut.id.substring(6)) + 1)); 					// adds blank list element below selected element
		}; 
		return addBut;													// return button element
	};
	
	// add Delete ID list item button
	function addIDDelButton(itemNo) { 						// itemNo targets specific list item
		var delIDBut = removeImg.cloneNode();				// create element
		delIDBut.id = "delIDBut" + itemNo;						// fill in element details
		delIDBut.onclick = function() { 							// on click calls remove function with param targeting the specific line
			console.log("Del ID Press");
			findAndRemoveItemFromSharedList("listTxt" + delIDBut.id.substring(8) + "listID",gapi.hangout.getLocalParticipantId(),true);
		}; 
		return delIDBut;											// return button element
	};
	
	// add Add ID list item button
	function addIDAddButton(itemNo) { 					// itemNo targets specific list item
		var addIDBut = addImg.cloneNode();			// create element
		addIDBut.id = "addIDBut" + itemNo;					// fill in element details
		addIDBut.onclick = function() { 						// on click calls remove function with param targeting the specific line
			console.log("Add ID press " + addIDBut.id.substring(8));
			var test = findAndAddNewItemToSharedList("listTxt" + addIDBut.id.substring(8) + "listID",gapi.hangout.getLocalParticipantId(),true);
			console.log("found loc? " + test);
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
		console.log("adding pic " + itemNo + " loc " + idLoc + " user " + userID);
		if (userID == 0){return "";};
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