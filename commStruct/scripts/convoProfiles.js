

var convoProfiles = [
		{	"profileName" : "Basic", "discription" : "basic profile operating with no aditional functionality",
			"allowButtingIn" : "true",
			"muteIfSpeaker" : "false",
			"userTypes" : [
				{"name" : "standard", "limit" : "0"},
				{"name" : "lead", "limit" : "0"}
				] },
			
		{	"profileName" : "No ButIns", "discription" : "basic profile that gards against butting in",
			"allowButtingIn" : "true",
			"muteIfSpeaker" : "false" ,
			"userTypes" : [
				{"name" : "standard", "limit" : "-1"},
				{"name" : "lead", "limit" : "2"}
				] }
    ];
