:: This batch script makes the Caché application deployment much faster by building and importing
:: the project. Replace the path below to your Caché installation and build & import application to
:: Caché using only one command.

:: Latest NodeJS & Caché 2016.2+ IS REQUIRED TO PROCEED

:: CHANGE THIS PATH TO YOUR CACHÉ INSTALLATION PATH ON WINDOWS
set CACHE_DIR=C:\Program Files\InterSystems\Cache20162
:: NAMESPACE IMPORTING TO
set NAMESPACE=SAMPLES

npm run gulp & echo w "OK:"_$system.OBJ.ImportDir("%~dp0build\cache",,"ck") halt | "%CACHE_DIR%\bin\cache.exe" -s "%CACHE_DIR%\mgr" -U %NAMESPACE%