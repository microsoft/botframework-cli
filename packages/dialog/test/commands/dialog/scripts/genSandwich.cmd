@echo off
rd /s /q %temp%\sandwich.out
call ..\..\..\..\bin\run dialog:generate ../forms/sandwich.schema -o %temp%/sandwich.out --verbose
call gencopy %temp%\sandwich.out %REPOS%\botbuilder-dotnet\tests\Microsoft.Bot.Builder.TestBot.Json\Samples\sandwich\ %1
