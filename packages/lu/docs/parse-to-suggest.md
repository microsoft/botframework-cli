# Parse to suggest models

Parse to suggest command examines every single .lu and .qna files and suggests one or more [LUIS][1] and or [QnA Maker][2] applications. 

There are two different use audience/ consumer of this - 
    1. Users of declarative based adaptive dialogs (e.g. composer)
    2. Users of code based adaptive dialogs 

## Core functionality

Given a list of .lu and .qna files as well as their hierarchy of composition, generate one or more LUIS and QnA Maker application per locale.

### Basic hierarchy with cross-training LUIS only

Given this folder structure for a bot, 

```
./Main/
      /Main.dialog .or. Main.cs .or. Main.ts .or. Main.js, ...
      /Main.lu
      /Main.lg
./Dia1/
      /Dia1.dialog .or. Dia1.cs .or. Dia1.ts .or. Dia1.js, ...
      /Dia1.lu
      /Dia2.lg
./Dia2/
      /Dia2.dialog .or. Dia2.cs .or. Dia2.ts .or. Dia2.js, ...
      /Dia2.lu
      /Dia2.lg
./Dia3/
      /Dia3.dialog .or. Dia3.cs .or. Dia3.ts .or. Dia3.js, ...
      /Dia3.lu
      /Dia3.lg
./Dia4/
      /Dia4.dialog .or. Dia4.cs .or. Dia4.ts .or. Dia4.js, ...
      /Dia4.lu
      /Dia4.lg
```

And given this hierarchy configuration 

```
./Main/Main.lu#Dia1_trigger -> ./Dia1/Dia1.lu
./Main/Main.lu#Dia2_trigger -> ./Dia2/Dia2.lu
./Dia2/Dia2.lu#Dia3_trigger -> ./Dia3/Dia3.lu
./Dia2/Dia2.lu#Dia4_trigger -> ./Dia4/Dia4.lu
```

Parse to suggest would result in the following changes to the .lu content

```
./Dia1/Dia1.lu with all intents + entities defined in ./Dia1/Dia1.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia2_trigger
./Dia2/Dia2.lu with all intents + entities defined in ./Dia2/Dia2.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia1_trigger
./Dia3/Dia3.lu with all intents + entities defined in ./Dia3/Dia3.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia1_trigger and utterances found under ./Dia2/Dia2.lu#Dia4_trigger
./Dia4/Dia4.lu with all intents + entities defined in ./Dia4/Dia4.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia1_trigger and utterances found under ./Dia2/Dia2.lu#Dia3_trigger
```

### Handling lang x locale

Given this folder structure for a bot, 

```
./Main/
      /Main.dialog .or. Main.cs .or. Main.ts .or. Main.js, ...
      /Main.lu
      /Main.fr-fr.lu
      /Main.lg
./Dia1/
      /Dia1.dialog .or. Dia1.cs .or. Dia1.ts .or. Dia1.js, ...
      /Dia1.lu
      /Dia1.fr-fr.lu
      /Dia2.lg
./Dia2/
      /Dia2.dialog .or. Dia2.cs .or. Dia2.ts .or. Dia2.js, ...
      /Dia2.lu
      /Dia2.fr-fr.lu
      /Dia2.lg
./Dia3/
      /Dia3.dialog .or. Dia3.cs .or. Dia3.ts .or. Dia3.js, ...
      /Dia3.lu
      /Dia3.lg
./Dia4/
      /Dia4.dialog .or. Dia4.cs .or. Dia4.ts .or. Dia4.js, ...
      /Dia4.lu
      /Dia4.lg
```

And given this hierarchy configuration 

```
./Main/Main.lu#Dia1_trigger -> ./Dia1/Dia1.lu
./Main/Main.lu#Dia2_trigger -> ./Dia2/Dia2.lu
./Dia2/Dia2.lu#Dia3_trigger -> ./Dia3/Dia3.lu
./Dia2/Dia2.lu#Dia4_trigger -> ./Dia4/Dia4.lu
./Main/Main.fr-fr.lu#Dia1_trigger -> ./Dia1/Dia1.fr-fr.lu
./Main/Main.fr-fr.lu#Dia2_trigger -> ./Dia2/Dia2.fr-fr.lu
```

Parse to suggest would result in the following changes to the .lu content

```
./Dia1/Dia1.lu with all intents + entities defined in ./Dia1/Dia1.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia2_trigger
./Dia2/Dia2.lu with all intents + entities defined in ./Dia2/Dia2.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia1_trigger
./Dia3/Dia3.lu with all intents + entities defined in ./Dia3/Dia3.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia1_trigger and utterances found under ./Dia2/Dia2.lu#Dia4_trigger
./Dia4/Dia4.lu with all intents + entities defined in ./Dia4/Dia4.lu and another `_Interruption` intent that has utterances found under ./Main/Main.lu#Dia1_trigger and utterances found under ./Dia2/Dia2.lu#Dia3_trigger
./Dia1/Dia1.fr-fr.lu with all intents + entities found in ./Dia1/Dia1.fr-fr.lu and another `_Interruption` intent that has utterances found under ./Main/Main.fr-fr.lu#Dia2_trigger.
./Dia2/Dia2.fr-fr.lu with all intents + entities found in ./Dia2/Dia2.fr-fr.lu and another `_Interruption` intent that has utterances found under ./Main/Main.fr-fr.lu#Dia1_trigger.
```

### Multiple dialog invocations in same trigger

Consider this bot content 

```
./Main/
      /Main.dialog .or. Main.cs .or. Main.ts .or. Main.js, ...
      /Main.lu
      /Main.lg
./Dia1/
      /Dia1.dialog .or. Dia1.cs .or. Dia1.ts .or. Dia1.js, ...
      /Dia1.lu
      /Dia2.lg
./Dia2/
      /Dia2.dialog .or. Dia2.cs .or. Dia2.ts .or. Dia2.js, ...
      /Dia2.lu
      /Dia2.lg
./Dia3/
      /Dia3.dialog .or. Dia3.cs .or. Dia3.ts .or. Dia3.js, ...
      /Dia3.lu
      /Dia3.lg
```

And given this hierarchy configuration 

```
./Main/Main.lu#Dia1_trigger -> ./Dia1/Dia1.lu
./Dia1/Dia1.lu#Dia2_trigger -> ./Dia2/Dia2.lu
./Dia1/Dia1.lu#Dia2_trigger -> ./Dia3/Dia3.lu
> The same trigger calls multiple dialogs.
```

Parse to suggest would result in the following changes to the .lu content

```
> no changes
```

### Local intents

Consider this bot content 

```
./Main/
      /Main.dialog .or. Main.cs .or. Main.ts .or. Main.js, ...
      /Main.lu
      /Main.lg
./Dia1/
      /Dia1.dialog .or. Dia1.cs .or. Dia1.ts .or. Dia1.js, ...
      /Dia1.lu
      /Dia2.lg
./Dia2/
      /Dia2.dialog .or. Dia2.cs .or. Dia2.ts .or. Dia2.js, ...
      /Dia2.lu
      /Dia2.lg
./Dia3/
      /Dia3.dialog .or. Dia3.cs .or. Dia3.ts .or. Dia3.js, ...
      /Dia3.lu
      /Dia3.lg
```

And given this hierarchy configuration 

```
./Main/Main.lu#Dia1_trigger -> ./Dia1/Dia1.lu
./Dia1/Dia1.lu#Dia2_trigger -> ./Dia2/Dia2.lu
./Dia1/Dia1.lu#Dia3_trigger -> ./Dia3/Dia3.lu
./Dia1/Dia1.lu#local_trigger1 -> <Self>
> Dia1 has three triggers, one trigger is a local intent (does not start another dialog).
```

Parse to suggest would result in the following changes to the .lu content

```
./Dia2/Dia2.lu with all intents + entities defined in ./Dia2/Dia2.lu and another `_Interruption` intent that has utterances found under ./Dia1/Dia1.lu#Dia3_trigger and ./Dia1/Dia1.lu#local_trigger1
./Dia3/Dia3.lu with all intents + entities defined in ./Dia3/Dia3.lu and another `_Interruption` intent that has utterances found under ./Dia1/Dia1.lu#Dia2_trigger and ./Dia1/Dia1.lu#local_trigger1
```

### No .lu content (local intents or input intents) in child dialog

Consider this bot content 

```
./Main/
      /Main.dialog .or. Main.cs .or. Main.ts .or. Main.js, ...
      /Main.lu
      /Main.lg
./Dia1/
      /Dia1.dialog .or. Dia1.cs .or. Dia1.ts .or. Dia1.js, ...
      /Dia1.lu
      /Dia2.lg
./Dia2/
      /Dia2.dialog .or. Dia2.cs .or. Dia2.ts .or. Dia2.js, ...
      /Dia2.lu (empty file/ no .lu content)
      /Dia2.lg
./Dia3/
      /Dia3.dialog .or. Dia3.cs .or. Dia3.ts .or. Dia3.js, ...
      /Dia3.lu
      /Dia3.lg
```

And given this hierarchy configuration 

```
./Main/Main.lu#Dia1_trigger -> ./Dia1/Dia1.lu
./Dia1/Dia1.lu#Dia2_trigger -> ./Dia2/Dia2.lu
> Dia2 does not have any .lu content or is empty file.
./Dia1/Dia1.lu#Dia3_trigger -> ./Dia3/Dia3.lu
```

Parse to suggest would result in the following changes to the .lu content

```
./Dia3/Dia3.lu with all intents + entities defined in ./Dia3/Dia3.lu and another `_Interruption` intent that has utterances found under ./Dia1/Dia1.lu#Dia2_trigger
```

[1]:https://luis.ai
[2]:https://qnamaker.ai