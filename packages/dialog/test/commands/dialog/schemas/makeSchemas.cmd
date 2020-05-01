@echo off
setlocal

call rush build
set ds=..\..\..\..\bin\run
call node %ds% dialog:merge *.schema -o app.schema

