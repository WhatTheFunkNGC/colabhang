

var convoProfiles = [
		{	"profileName" : "Basic", "discription" : "basic profile operating with no aditional functionality",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"quiteMsg" : "Do you have anything to say?" , 
					"veryActiveMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "30",
					"highMsgLevel" : "60",
					
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false",
				}
				] },
			
		{	"profileName" : "No ButIns", "discription" : "basic profile that gards against butting in",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"quiteMsg" : "Do you have anything to say?" , 
					"veryActiveMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "30",
					"highMsgLevel" : "60",
					
					"allowButtingIn" : "false",
					"muteIfSpeaker" : "false" 
				},
				{"name" : "lead", "limit" : "2",
					"quiteMsg" : "Do you have anything to say?" , 
					"veryActiveMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "30",
					"highMsgLevel" : "60",
					
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false" 
				}
				] },
		{	"profileName" : "dominant speaker", "discription" : "only the speaker is able to speak",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"quiteMsg" : "Do you have anything to say?" , 
					"veryActiveMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "30",
					"highMsgLevel" : "60",
					
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
				}
				] }
    ];
