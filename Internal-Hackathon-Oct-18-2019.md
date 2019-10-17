# Internal Hackathon for SDK 4.6 release

Where: Kitchen
When: October 18, 2019 10:00am to noon
Who: You :)

**Goal**: Get team’s assistance in flushing out last minute items to support smooth transition from legacy tools to new and improved BF CLI.


Please file issues here: https://github.com/microsoft/botframework-cli/issues

## Instructions
* Download and install from: **TBD:Emilio**
* Ensure Telemetry is enabled:  **TBD:Emilio**
* Hack it: Use to create/manage bots
* Hack it challenge: Use with Virtual Assistant

For any questions and feedback please talk to us!

_Eyal, Emilio, Axel, and Jonathan_

## Example Hack Objectives

### Global / Foundation
Owner: **Emilio + Eyal**
* Ensure documentation quality in MS DOCS and READMEs (links: a, b, c)
* Ensure command line consistency across all tools
* Ensure foundation & all command groups align to Contributing.md guideline (common flags, I/O ops, logging)
* Ensure npm Installation paths, messaging (link)
* Ensure deprecation messages on corresponding legacy tools
* Ensure telemetry accuracy
* Ensure configuration management 
* Enable/Disable telemetry & verify accuracy in telemetry logging
* Security/Privacy pass complete (not hackathon per se)

### Chatdown
Owner: **Jonathan**
* Ensure commands and flags work as expected, testing instructions below

### qnamaker
Owner: **Emilio**

### Ludown
Owner: **Emilio**
 
### LuisGen
Owner: **Axel**

* Generate file with no specific name (use class name)
* Generate file with specific name different than class name
* Generate file with no specific name and target name already exists
* Generate file with specific name and target name already exists
* Generate file with no specific name, target name already exists and send force flag
* Generate file with specific name, target name already exists and send force flag

## Example Scenarios

* Convert chatdown script from Emulator (?)
* QnAMaker: Prepare, create, train, publish, delete KB
* Luis: convert .lu / .luis files
* Challenge: Create & run a Virtual Assistant script  (that's what the VA team will do after Ignite if you didn't do it for them :))

## Other Suggestions

### Chatdown

Run the following commands and ensure the results match the expectations, indicated in square brackets:
	
bf chatdown
bf chatdown -h
[should display the help contents]
	
(echo bot=jon) | ./bin/run chatdown
[should display transcript in console]
	
bf chatdown --in ./test/utils/cli.sample.chat
bf chatdown --in 'C:\Projects\cli\botframework-cli\packages\chatdown\test\utils\cli.sample.chat' [absolute path to file]
[should output transcipt file to console]
	
bf chatdown --in ./test/utils/cli.sample.chat --prefix
[should output transcipt file to console, prefixed with the package name]
	
bf chatdown --in ./test/utils/cli.doesntexist.chat 
[should display an error message: 'no such file or directory']
	
bf chatdown --in ./test/utils/cli.sample.chat --out ./test/testout 
[should output transcipt file to specified dir]
	
bf chatdown --in ./test/utils/cli.sample.chat --out 'C:\Projects\cli\botframework-cli\packages\chatdown\test\utils\testout' [absolute path to directory]
[should output transcipt file to specified dir]
	
bf chatdown --in ./test/utils/cli.sample.chat --out ./test/doesntexist
[should create a dir that doesnt exist and output transcipt file there ]

---
<img src="https://github.com/microsoft/botframework-cli/blob/esbfclispec2/BF%20CLI%20Hackathon%20Flyer.jpg"
     alt="Bot Framework CLI Hackathon"
     style="float: left; margin-right: 10px;" />
     
