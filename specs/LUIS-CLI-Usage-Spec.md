## BF CLI LUIS API Commands Usage Form

All commands below assume to stem off of the `bf luis:*` command group.



### init

Synopsis: Stores *default* LUIS application values in global config. 

Behavior: 

* All values are optional, if none specified, returns with message confirming nothing was performed and usage.
* Prompts sequentially, verifies user intent (y/n) before writing to global config
* Confirms operation (true for all commands, *will not repeat)

Reference: original  *luis init* command

Parameters:

```
  --authKey			LUIS authoring key
  					* aka as Ocp-Apim-Subscription-Key or subscription key 
  --appId			LUIS application Id
  --verId			LUIS version Id
  --region			LUIS application region. 
  					Will be prepended to endpoint hostname:
                      <region>.api.cognitive.microsoft.com
```





### clone

Synopsis: Creates a new version equivalent to the current snapshot of the selected application version.

Reference:  [Clone version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3a) 

Parameters:

```
 --srcVerId			Source version to clone (mandatory, defaults to config:LUIS:verId)
 --destVerId		Destination version to create (mandatory)
 --appId			LUIS application Id (mandatory, defaults to config:LUIS:appId)
 --authKey			LUIS authoring (Ocp-Apim-subscription) key

```

Returns:

* Operation success confirmation
  * Or error code with error message
* Echo newly created version