:: This batch script makes the Caché application deployment faster. Replace the path below to your
:: Caché installation and build & import application to Caché only by one command.

:: CHANGE THIS PATH TO YOUR CACHÉ INSTALLATION PATH ON WINDOWS
set CACHE_DIR=C:\Program Files\InterSystems\Cache20162

npm run gulp & echo w "OK:"_$system.OBJ.ImportDir("%~dp0build\cache",,"ck") halt | "%CACHE_DIR%\bin\cache.exe" -s "%CACHE_DIR%\mgr" -U SAMPLES