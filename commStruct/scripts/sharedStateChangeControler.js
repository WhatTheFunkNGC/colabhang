(function (window) {	
  "use strict";	
  	
  function sharedStateChangeControler() {	
    console.log("Starting...");	
    gapi.hangout.onApiReady.add(this.onApiReady.bind(this));	
  }	
  	
  sharedStateChangeControler.prototype.onApiReady = function (event) {	
    if (event.isApiReady === true) {	
      console.log("API Ready");	
	  
		gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {				// add callback event for list change
		updateChecker(stateChangeEvent.addedKeys,stateChangeEvent.removedKeys);
		});
    };	
  };	
  		
  	
  /* function to orginise state update and call relivent functions
		addedKeys - a list of added key pairs
		removedKeys - a list of removed key pairs */
	function updateChecker (addedKeys,removedKeys){
		var itemNo, div;
		div = document.getElementById(mainListerTable);
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
						updateIDlistDisplay(itemNo,gapi.hangout.data.getValue("listTxt" + itemNo + "listID"));
					};											
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
						updateIDlistDisplay(itemNo,0);
					};				
				};				
			};
			//console.log("removed check done");
		};
	};	
  	
  var sharedStateChangeControler = new sharedStateChangeControler();	
}(window));