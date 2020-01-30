@echo off
call ..\..\..\..\bin\run dialog:generate ../forms/tahiti.schema -o %temp%/tahiti.out --force --verbose -t ../templates/tahiti standard
call gencopy %temp%\tahiti.out %REPOS%\botbuilder-dotnet\tests\Microsoft.Bot.Builder.TestBot.Json\Samples\tahiti\ %1

