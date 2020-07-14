rem @echo off
setlocal

call rush build
set ds=..\..\..\bin\run

echo *** loose schema
call node %ds% dialog:merge schemas/*.schema -o oracles/app.schema --verbose
echo ''

echo *** project3.csproj
call node %ds% dialog:merge projects/project3/project3.csproj -o oracles/project3 --nugetRoot nuget --verbose
echo ''

echo *** root-package
call node %ds% dialog:merge npm/node_modules/root-package/package.json -o oracles/root-package --verbose
