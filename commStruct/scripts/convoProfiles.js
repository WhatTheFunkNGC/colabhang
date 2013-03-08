

var convoProfiles = [
		{	"profileName" : "Basic", "discription" : "basic profile operating with no aditional functionality",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false",
				}
				] },
			
		{	"profileName" : "No ButIns", "discription" : "basic profile that gards against butting in",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"allowButtingIn" : "false",
					"muteIfSpeaker" : "false" 
				},
				{"name" : "lead", "limit" : "2",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "false" 
				}
				] },
		{	"profileName" : "dominant speaker", "discription" : "only the speaker is able to speak",
			"userTypes" : [
				{"name" : "standard", "limit" : "-1",
					"allowButtingIn" : "true",
					"muteIfSpeaker" : "true",
				}
				] }
    ];
