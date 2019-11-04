## BF CLI LUIS API Commands Usage Form

### General and Common

Use the following common guidelines for all commands (unless explicitly excluded).

* All commands return:
	* Success or Error status
	* Error code and message if available
* Upon successful completion:
	* Print back affected values (if too long, specify container e.g. filename or use ellipsis ...)
	* Server detailed response (e.g. training status)
* All commands must display synopsis with example in help
* All commands must print which flags/arguments are optional, mandatory and default values
* All lengthy operations (> 5 seconds) shall print progress indicator (dots at 5 sec interval)
* All flags assume to be provided value pair (e.g. -o, --out implies -o, --out \<filename\>)
* All flags that are marked `mandatory default to...` are mandatory *unless* specified in config in which case they default to provided values in config file

All commands below assume to stem off of the `bf luis:*` command group.



### LUIS Help

Synopsis: Manages LUIS assets on service and/or locally. 

See https://Luis.ai for Luis Service APIs.

### init

Synopsis: Stores *default* LUIS application values in global config. 

Behavior: 

* All values are optional, if none specified, returns with message confirming nothing was performed and usage.
* Prompts sequentially, verifies user intent (y/n) before writing to global config

Reference: original  *luis init* command

Parameters:

```
  --subscriptionKey	LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key) 
  --appId			LUIS application Id
  --verId			LUIS version Id
  --region			LUIS application region. 
  					Will be prepended to endpoint hostname:
                      <region>.api.cognitive.microsoft.com
                      Available Regions: westus, westeurope, australiaeast
```



### clone:version

Synopsis: Creates a new version equivalent to the current snapshot of the selected application version.

Reference:  [Clone version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3a) 

Parameters:

```
 --srcVerId			Source version to clone (mandatory, defaults to config:LUIS:verId)
 --destVerId		Destination version to create (mandatory)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --subscriptionKey			LUIS authoring (Ocp-Apim-subscription) key
```

Returns:

* Operation success confirmation
  * Or error code with error message
* Echo newly created version



### create:application

Synopsis: Creates a new LUIS application

Reference:  [Add application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --name				Name of LUIS application
 --description		Description of LUIS application
 --culture			Specify culture language (default: en-us)
 --tokenizerVersion	**TBD**: Get description from LUIS Team (optional/mandatory?)
 --usageScenario	**TBD**: Get description from LUIS Team (optional/mandatory?)
 --domain			**TBD**: Get description from LUIS Team (optional/mandatory?)
 --verId			LUIS version Id. (mandatory, defaults to config:LUIS:verId)
```

Returns:

* Operation success confirmation
  * Or error code with error message
* Echo newly created application Id



###  delete:application

Synopsis:  Deletes a LUIS application. 

Reference:  [Delete application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c39) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --force			If specified, ignore application dependencies. (optional, default: false). **TBD**: Do we still have to specify true/false? presence of flag should suffice
```

Returns:

* Operation success confirmation
  * Or error code with error message



###  delete:version

Synopsis:  Deletes a LUIS application version. 

Reference:   [Delete version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3f) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --verId			Version to delete (mandatory)
```

Returns:

* Operation success confirmation
  * Or error code with error message



###   export:version

Synopsis:   Exports a LUIS application to JSON format . 

Reference:    [Export application version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --verId			Version to export (mandatory, defaults to config:LUIS:verId)
 --format			Export format (optional, default: json) **TBD: ask luis for valid formats (json, lu?)
 --out, -o			Save exported application to specified file, uses STDOUT if not specified (optional)
 --force			Overwrites output file if exists, otherwise creates a parallel numbered file (optional)
 
```

Returns:

* Operation success confirmation
  
  * Or error code with error message
  
* Writes exported contents to specified destination

  * If file specified, print out written file full path

  

### import:application 

Synopsis:  Imports LUIS application from JSON or LU content.  

Reference:     [Import application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c31) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --name				LUIS application name (optional)
 --in, -i			File path containing LUIS application contents, uses STDOUT if not specified (mandatory)
  --format			Content format (optional, default: json) **TBD: ask luis for valid formats (json, lu?) 
  						**TBD**: This is whats in the ContentType (1) 
  						**TBD**:  Detect instead
 --requestContentType	**TBD**: ContentType (2). Preferred to *not* expose, confusing dup. just use the one modality instead if possible
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints out newly created appId

  

### import:version

Synopsis:   Imports a new version into a LUIS application from JSON or LU content.   

Reference:      [Import version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5892283039e2bb0d9c2805f5) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --verId			Version to export (mandatory, defaults to config:LUIS:verId)
 --format			Import format (optional, default: json) 
 					**TBD: ask luis for valid formats (json, lu?) 
  					**TBD**: This is whats in the ContentType (1) 
  					**TBD**: Detect instead 					
 --in, -i			File path containing LUIS application contents, uses STDOUT if not specified (mandatory)
 --requestContentType	**TBD**: Preferred to *not* expose, confusing dup. just use the one modality instead if possible
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints out created version Id

  

### list:applications

Synopsis:    Lists all applications on LUIS service.

Reference:       [List applications](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c30) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --skip				Number of entries to skip. Default: 0 (no skips)
 --take				Number of etnries to return. Maximum page size is 500. Default: 100
 -o, --out 			Output results to specified file in JSON format, otherwise prints to STDOUT (optional)
 					**TBD**: Not all commands do it. Optional, ok to skip file output
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints out application list unless output file is specified

  

### list:endpoints

Synopsis:     Returns available deployment endpoints

Reference:        [Get application endpoints]( https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/590aff885aca2f09e404ec3f )  **TBD**: Entry in original table is wrong.

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 -o, --out 			Output results to specified file in JSON format, otherwise prints to STDOUT (optional)
 					**TBD**: Not all commands do it. Optional, ok to skip file output
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints out deployment endpoints unless output file is specified

  

### list:versions

Synopsis:     Returns application's versions

Reference:         [List versions](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3c) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --skip				Number of entries to skip. Default: 0 (no skips)
 --take				Number of etnries to return. Maximum page size is 500. Default: 100
 -o, --out 			Output results to specified file in JSON format, otherwise prints to STDOUT (optional)
 					**TBD**: Not all commands do it. Optional, ok to skip file output
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints out application's versions information unless output file is specified

  

### publish:application **TBD**: Original spec states publish:version

Synopsis:     Publishes application's version

Reference:         [Publish application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3b) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --verId			Version to publish (mandatory, defaults to config:LUIS:verId)
 --staging			Publishes application version to Staging slot, otherwise publish to production (default: false)
 --direct			Available only in direct version query. Do not publish to staging or production (default: false)
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints out operations detailed results e.g.

  ```json
  {
      "versionId": "0.1",
      "directVersionPublish": false,
      "endpointUrl": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00000000-0000-0000-0000-0000000000",
      "isStaging": false,
      "assignedEndpointKey": null,
      "region": "westus",
      "endpointRegion": "westus",
      "publishedDateTime": "2019-01-01T00:00:01Z",
      "failedRegions": ""
  }
  ```

  

  ### rename:application

  Synopsis:     Renames the application and updates its description

  Reference:          [Rename application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c38) 

  Parameters: 

  ```
   --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
   --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
   --name				Name of LUIS application (mandatory)
   --description		Description of LUIS application (mandatory)
  ```

  Returns:

  * Operation success confirmation
    * Or error code with error message



### rename:version

Synopsis:      Renames application version 

Reference:          [Rename version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3e) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --verId			Version to update (mandatory, defaults to config:LUIS:verId)
 --newVerId			New version name (mandatory)
```

Returns:

* Operation success confirmation
  * Or error code with error message



### show:application

Synopsis:      Shows application information

Reference:           [Get application info](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c37) 

Parameters: 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints output to STDOUT in returned JSON format e.g.

  ```json
  {
      "id": "00000000-0000-0000-0000-0000000000",
      "name": "LUIS App",
      "description": "Description of LUIS App",
      "culture": "en-us",
      "usageScenario": "",
      "domain": "",
      "versionsCount": 3,
      "createdDateTime": "2019-01-00T00:00:00Z",
      "endpoints": {
          "PRODUCTION": {
              "versionId": "1.1",
              "directVersionPublish": false,
              "endpointUrl": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00000000-0000-0000-0000-0000000000",
              "isStaging": false,
              "assignedEndpointKey": null,
              "region": null,
              "endpointRegion": "westus",
              "publishedDateTime": "2019-01-01T00:00:01Z",
              "failedRegions": null
          }
      },
      "endpointHitsCount": 24,
      "activeVersion": "0.22",
      "ownerEmail": null,
      "tokenizerVersion": "1.0.0"
  }
  ```

  

### show:training **TBD**: Change from show:trainingstatus

Synopsis:      Shows training status

Reference:            [Training status](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46)

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --verId			Version to show training status (mandatory, defaults to config:LUIS:verId)
```

Returns:

* Operation success confirmation

  * Or error code with error message

* Prints out results of training to STDOUT e.g.

  ```json
  [
      {
          "modelId": "00000000-0000-0000-0000-0000000000",
          "details": {
              "statusId": 2,
              "status": "UpToDate",
              "exampleCount": 27
          }
      },
      {
          "modelId": "00000000-0000-0000-0000-0000000001",
          "details": {
              "statusId": 2,
              "status": "UpToDate",
              "exampleCount": 18
          }
      }
  ]
  ```

### train  **TBD**: Changed from original table spec

Synopsis:     Issues asynchronous training request for LUIS application

Reference:             [Train version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45) 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --verId			Version to train (mandatory, defaults to config:LUIS:verId)
```

Returns:

* Operation success confirmation
  * Or error code with error message



### query **TBD**: Ensure it is the right one

Synopsis:     Queries application for intent predictions

Reference:            [Query application](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) 

```
 --subscriptionKey	LUIS cognitive services subscription key (mandatory, default: config:LUIS:subscriptionKey)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --query			Query string to predict (mandatory)
 --verbose			Returns all intents, otherwise only top scoring intent. (default: false)
 --spellcheck		Performs spell checking (optional, default: false)
 --staging			Uses staging endpoint slot, otherwise prod endpoint (default: false)
 --spellcheckKey	Bing spell-check subscription key (required for spell checking, otherwise optional)
 --timezoneOffset	Timezone offset for the location of the request in minutes (optional)
 --log				Logs query operation on service (default: true)
```

Returns:

* Operation success confirmation
  * Or error code with error message
* Prints out results of query to STDOUT e.g.

```json
{
  "query": "\"flight\"",
  "topScoringIntent": {
    "intent": "BookFlight",
    "score": 0.582334042
  },
  "intents": [
    {
      "intent": "BookFlight",
      "score": 0.582334042
    },
    {
      "intent": "Cancel",
      "score": 0.0528670624
    },
    {
      "intent": "None",
      "score": 0.0265585221
    },
    {
      "intent": "GetWeather",
      "score": 0.00433267839
    }
  ],
  "entities": []
}
```

