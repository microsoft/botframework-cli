@echo off
setlocal
if "%REPOS%" EQU "" goto help

set indir=%TEMP%\sandwich.out
if "%1" NEQ "" set indir=%1

set outdir=%REPOS%\botbuilder-dotnet\tests\Microsoft.Bot.Builder.TestBot.Json\Samples\GeneratedForm\
if "%2" NEQ "" set outdir=%2

echo Copying and publishing form to LUIS
echo Input: %indir% 
echo Output: %outdir% and publishing to LUIS

pushd %indir%
rd /s %outdir%
xcopy /s * %outdir%
cd %outdir%
call lubuild --dialogs
popd
goto done

:help
echo formCopy [input] [output]
echo input default: %TEMP%\sandwich.out
echo output default: %%REPOS%%\botbuilder-dotnet\tests\Microsoft.Bot.Builder.TestBot.Json\Samples\GeneratedForm\
echo Copies input to output and publishes to LUIS
echo It also requires the environment variable REPOS set to the root of your repos like c:\repos

:done