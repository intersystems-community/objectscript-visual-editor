:: This batch script makes the Caché application deployment much faster by building, importing and
:: exporting the XML the project. Replace the path below to your Caché installation and build & import application to
:: Caché using only one command.

:: Latest NodeJS & Caché 2016.1+ IS REQUIRED TO PROCEED
@echo off

:: CHANGE THIS PATH TO YOUR CACHÉ INSTALLATION PATH ON WINDOWS
set CACHE_DIR=C:\Program Files\InterSystems\Cache20162
:: NAMESPACE TO IMPORT PACKAGE TO
set NAMESPACE=SAMPLES

:: Build and import application to Caché
echo Building the project...
npm run gulp && ^
echo w "IMPORT SUCCESS: "_$system.OBJ.ImportDir("%~dp0build\cache",,"ck") halt | "%CACHE_DIR%\bin\cache.exe" -s "%CACHE_DIR%\mgr" -U %NAMESPACE% && ^
echo w $c(13,10)_"EXPORT SUCCESS: "_$system.OBJ.ExportPackage("VisualEditor", "%~dp0build\VisualEditor-v"_##class(VisualEditor.Installer).#VERSION_".xml") halt | "%CACHE_DIR%\bin\cache.exe" -s "%CACHE_DIR%\mgr" -U %NAMESPACE%