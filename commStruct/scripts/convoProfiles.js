

var convoProfiles = [
		{	"profileName" : "Basic", "discription" : "basic profile operating with no aditional functionality",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",				
					"notifyChatLength" : "false",
					"muteChatLength" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false",
				}
				] },
			
		{	"profileName" : "Family", "discription" : "basic profile that gards against butting in",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					
					"notifyChatLength" : "true",
					"muteChatLength" : "false",
					"allowButtingIn" : "false",
					"muteIfSpeaker" : "false" 
				},
				{"name" : "lead", "limit" : "2",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					
					"notifyChatLength" : "true",
					"muteChatLength" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false" 
				}
				] },
		{	"profileName" : "Shapeing", "discription" : "only the speaker is able to speak",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"lowMsgLevel" : "-20",
					"highMsgLevel" : "20",
					
					"notifyChatLength" : "true",
					"muteChatLength" : "false",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
				}
				] },
				
		{	"profileName" : "Strict Shapeing", "discription" : "only the speaker is able to speak",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"minMsg" : "You have barly said anything, you will get the floor in 10 seconds",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said alot, does anyone else want to speak?",
					"maxMsg" : "Your dominating the convosation, you will be muted in 20 seconds, finnish up your point",
					"minMsgLevel" : "-50",
					"lowMsgLevel" : "-10",
					"highMsgLevel" : "10",
					"maxMsgLevel" : "50",
					"muteCountdownMsgLength" : "10000",
					"controlMsgLength" : "20000",
					
					"notifyChatLength" : "true",
					"muteChatOnTimer" : "true",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
				}
				] }
    ];
