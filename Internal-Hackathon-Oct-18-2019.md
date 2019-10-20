# Internal Hackathon for SDK 4.6 release

Where: Kitchen
When: October 18, 2019 10:00am to noon
Who: You :)

**Goal**: Get team’s assistance in flushing out last minute items to support smooth transition from legacy tools to new and improved BF CLI.


Please file issues here: https://github.com/microsoft/botframework-cli/issues

## Instructions
* Download and install from: 
  * Run npm config set registry https://botbuilder.myget.org/F/botframework-cli/npm/
  * Run npm i -g @microsoft/botframework-cli

* Ensure Telemetry is enabled: 
  * Accepting the promp after the installation OR 
  * Run bf config:set:telemetry --enable
  * To reset configuration state such as for re-propmt delete the following file (Windows): 
    * %LOCALAPPDATA%\@microsoft\botframework-cli\config.json)
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
* Pipe data from one command to another if input/output matches

### Chatdown
Owner: **Jonathan**
* Ensure commands and flags work as expected, testing instructions below

### qnamaker

* Create Kb
* Export Kb
* Check config file gets updated acordingly
* Publish Kb
* List Kbs
* Get Kb info
* Refresh endpoint keys
* Delete kb
* Set QnA Maker config file

### Ludown
Owner: **Emilio**

* Parse lu file to Luis Json
* Parse Luis json to lu file
* Parse lu file to QnA Json
* Parse QnA json to lu file
* Translate lu file
* Translate Qna Json
* Transalte Luis Json
 
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

