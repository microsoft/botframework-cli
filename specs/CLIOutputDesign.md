# BF CLI Output Design Guidelines

To ensure that output is both human readable for interactive execution and machine readable for automatic execution (e.g. CI/CD pipelines) , it is best to provide two distinct and consistent output modes.

## Requirements

* Follow [Heroku Output  Design Guidelines](https://devcenter.heroku.com/articles/cli-style-guide#human-readable-output-vs-machine-readable-output), we will format the output based on provided flag 
  * --format : [Json | terse] 	Prints out all machine readable (Json) or human readable (terse) formats. 

* Default: human readable *terse* format
* All commands and subcommands must respect this flag
* Default behavior may be stored in global configuration. 
* Precedence order: 
  * If not specified: default
  * If in config: config value
  * if in command line override all other options
* The foundation will pass it down to subsequent libraries. All commands shall use the foundation configuration and subsystem for logging
* All commands must use provided logging mechanism (per Heroku guidelines)
* All commands must return success or failure status as follows:
  * Status: [Success | Error]
* All errors must be detailed containing file/line number, exception code, exception or error message
* Status and error messages shall be logged to STDERR and STDIN
* Detailed logging shall be enabled with the --verbose flag (see original spec)
* Color coding: 
  * Success code: White (default, most readable). Consideration the word ""*success*"" may be set to green. 
  * Error code: Red
  * Warning: Dark Yellow



### Human Readable Format

Human readable format, aka terse will be structured as follows:

LogOutput := LogLine [LogLine | *null* ] ModuleId CompletionMessage

CompletionMessage := [Error | Success] : ErrorMessage. (ErrorCode)

LogLine := \<free form text>\n

ModuleId := Module: \<Library name>

ErrorMessage := \<exception or explicit short failure/success notice>

ErrorCode := [\<exception or error code> |  DefaultCode]  //if error code isn't available use DefaultCode

DefaultCode :=  [DefaultSuccessCode | DefaultErrorCode]

DefaultSuccessCode := 0

DefaultErrorCode := -1



### Json Automation Format

The Json format for autmation will use the following format

```json
{
	"Details" : "<verbose output with \n line breaks",
    "Module" : "<Library name>"
	"Status" : "Success | Error",
	"ErrorMessage" : "<Error message>",
	"ErrorCode" : "<code>"
}
```





## References



* [Heroku Output Design Guidelines](https://devcenter.heroku.com/articles/cli-style-guide#human-readable-output-vs-machine-readable-output)



