

var convoProfiles = [
		{	"profileName" : "Basic", "discription" : "basic profile operating with no additional functionality",
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
			
		{	"profileName" : "Family", "discription" : "basic profile that guards against butting in",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"lowMsg" : "Say something!" , 
					"highMsg" : "You have been nattering for a while",
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
					
					"overideShapeing" : "false",
					"notifyChatLength" : "false",
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
					"highMsg" : "You have said a lot, does anyone else want to speak?",
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
		{	"profileName" : "Meeting", "discription" : "Facilitate group discussion on points in a shaped manner",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"minMsg" : "You have barley said anything, you will get the floor in 10 seconds",
					"lowMsg" : "Do you have anything to say?" , 
					"highMsg" : "You have said a lot, does anyone else want to speak?",
					"maxMsg" : "Your dominating the convosation, you will be muted in 20 seconds, finnish up your point",
					"minMsgLevel" : "-50",
					"lowMsgLevel" : "-20",
					"highMsgLevel" : "20",
					"maxMsgLevel" : "70",
					"muteCountdownMsgLength" : "10000",
					"controlMsgLength" : "20000",
					
					"overideShapeing" : "false",
					"notifyChatLength" : "true",
					"muteChatOnTimer" : "true",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false",
					"highlightControl" : "true"
				}
				] },
		{	"profileName" : "Strict Meeting", "discription" : "Strict business meeting where members are all meant to contribute evenly",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"minMsg" : "You haven't contributed anything, you will have floor in 10 seconds",
					"lowMsg" : "Do you have anything to contribute?" , 
					"highMsg" : "You have been speaking for a while. try not to dominate the discussion",
					"maxMsg" : "Your dominating the convocation and will be muted in 10 seconds, finish up your point",
					"minMsgLevel" : "-40",
					"lowMsgLevel" : "-15",
					"highMsgLevel" : "15",
					"maxMsgLevel" : "50",
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
					"highMsg" : "You have said a lot, does anyone else want to speak?",
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
