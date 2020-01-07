@echo off
call ..\..\..\..\bin\run dialog:generate ../forms/sandwich.schema -o %temp%/sandwich.out --force --verbose
call gencopy %temp%\sandwich.out %REPOS%\botbuilder-dotnet\tests\Microsoft.Bot.Builder.TestBot.Json\Samples\GeneratedForm\ %1
