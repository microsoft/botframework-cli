@echo off

set NODE_OPTIONS="--max-old-space-size=32768"

node %NODE_OPTIONS% "%~dp0\run" %*
