# Notes on Tahiti mapping
Notes on [Tahiti Examples](https://cognitionwiki.com/display/TAH/Representative+examples+of+the+Custom+Commands+engine).  It does not look like anything they are doing is not easily modeled in adaptive.

## General patterns
* Command = event trigger 
  * TriggeringExamples = lu patterns needed at generation time
  * lgTemplates = .lg template for runtime -- standard and overriding

## Example Simple Confirmations
* Schema is just DateTime property
* Has standard completion
* Behavior for things like default date/time.  Put into set?

## Example One-step correction prior completion
* Inlines both normalized values and .lu synonyms in file format.
* Min/max for number in range

## Example one-step correction post-completion
* Looks like unexpected confirmation

## Repeat/cancel
* Built-in template for help/cancel

## Multiple parameters of the same type
* Numbers with roles

## Open ended input
* Uses utterance

## Built-in parameter validations
* Min/max with error message

## Slot over filling
* Standard LUIS model

## Max-turn handling
* Retries

## Rules for business rules
* Custom actions in flow
