@echo off
setlocal
if "%REPOS%" EQU "" goto help

set dobuild=yes
if "%1" NEQ "" set dobuild=%1

set indir=%TEMP%\sandwich.out
if "%2" NEQ "" set indir=%2

set outdir=%REPOS%\botbuilder-dotnet\tests\Microsoft.Bot.Builder.TestBot.Json\Samples\GeneratedForm\
if "%3" NEQ "" set outdir=%3

echo Copying and publishing form to LUIS
echo lubuild: %dobuild%
echo Input: %indir% 
echo Output: %outdir% and publishing to LUIS

pushd %indir%
if "%dobuild%" NEQ "yes" goto copy
rd /s %outdir%

:copy
xcopy /s * %outdir%

if "%dobuild%" NEQ "yes" goto pop
cd %outdir%
call lubuild --dialogs

:pop
popd
goto done

:help
echo genCopy [lubuild] [input] [output]
echo lubuild default: yes
echo input default: %TEMP%\sandwich.out
echo output default: %%REPOS%%\botbuilder-dotnet\tests\Microsoft.Bot.Builder.TestBot.Json\Samples\GeneratedForm\
echo Copies input to output and publishes to LUIS
echo It also requires the environment variable REPOS set to the root of your repos like c:\repos

:done