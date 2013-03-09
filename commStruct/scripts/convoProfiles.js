

var convoProfiles = [
		{	"profileName" : "Basic", "discription" : "basic profile operating with no aditional functionality",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",				
					"notifyChatLength" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false",
				}
				] },
			
		{	"profileName" : "No ButIns", "discription" : "basic profile that gards against butting in",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					
					"notifyChatLength" : "true",
					"allowButtingIn" : "false",
					"muteIfSpeaker" : "false" 
				},
				{"name" : "lead", "limit" : "2",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					
					"notifyChatLength" : "true",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false" 
				}
				] },
		{	"profileName" : "Strict", "discription" : "only the speaker is able to speak",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"minMsgLevel" : "-50",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					"maxMsgLevel" : "50",
					
					"notifyChatLength" : "true",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
				}
				] }
    ];
