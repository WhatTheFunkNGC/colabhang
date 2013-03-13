

var convoProfiles = [
		{	"profileName" : "Basic", "discription" : "basic profile operating with no aditional functionality",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",	
					"overideShapeing" : "false",				
					"notifyChatLength" : "false",
					"muteChatLength" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false",
					"highlightControl" : "true"
				}
				] },
			
		{	"profileName" : "Family", "discription" : "basic profile that gards against butting in",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					
					"overideShapeing" : "false",
					"notifyChatLength" : "true",
					"muteChatLength" : "false",
					"allowButtingIn" : "false",
					"muteIfSpeaker" : "false",
					"highlightControl" : "false"
				},
				{"name" : "lead", "limit" : "2",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					
					"overideShapeing" : "false",
					"notifyChatLength" : "true",
					"muteChatLength" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false",
					"highlightControl" : "true"
				}
				] },
		{	"profileName" : "Shapeing", "discription" : "only the speaker is able to speak",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-20",
					"highMsgLevel" : "20",
					
					"overideShapeing" : "false",
					"notifyChatLength" : "true",
					"muteChatLength" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
					"highlightControl" : "true"
				}
				] },
		{	"profileName" : "Strict Shapeing", "discription" : "only the speaker is able to speak",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"minMsg" : "You have barly said anything, you will get the floor in 10 seconds",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"maxMsg" : "Your dominating the convosation, you will be muted in 20 seconds, finnish up your point",
					"minMsgLevel" : "-40",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					"maxMsgLevel" : "30",
					"muteCountdownMsgLength" : "10000",
					"controlMsgLength" : "20000",
					
					"overideShapeing" : "false",
					"notifyChatLength" : "true",
					"muteChatOnTimer" : "true",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
					"highlightControl" : "true"
				}
				] },
		{	"profileName" : "Strict Meeting", "discription" : "setup to make all members speak evenly",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"minMsg" : "You have barly said anything, you will get the floor in 10 seconds",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"maxMsg" : "Your dominating the convosation, you will be muted in 20 seconds, finnish up your point",
					"minMsgLevel" : "-30",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					"maxMsgLevel" : "40",
					"muteCountdownMsgLength" : "10000",
					"controlMsgLength" : "20000",
					
					"overideShapeing" : "false",
					"notifyChatLength" : "true",
					"muteChatOnTimer" : "true",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
					"highlightControl" : "false"
				},
				{"name" : "Leader", "limit" : "1",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					"muteCountdownMsgLength" : "10000",
					"controlMsgLength" : "20000",
					
					"overideShapeing" : "true",
					"notifyChatLength" : "true",
					"muteChatOnTimer" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
					"highlightControl" : "true"
				}
				] }
    ];
