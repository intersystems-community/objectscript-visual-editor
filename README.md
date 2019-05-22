# ObjectScript Visual Editor <sup>(beta)</sup>

A Web-based user interface for InterSystems products (IRIS, Caché, Ensemble, HealthShare, etc) which allows to create and manage classes
literally without touching any code.

Features
--------

+ Simple, intuitive, **web-based** visual class editing tool for both desktop and touchscreen devices;
+ Supports all basic class editing functionality:
    + Adding/deleting classes, editing class keywords, comments, etc;
    + Adding/deleting/altering class members: parameters, properties, methods, queries, xDatas, indices;
    + **Convenient code editing** for methods and xDatas;
    + Editing all class members keywords with inputs, drop-downs and suggestions;
    + XData code highlight (ObjectScript highlighting is coming!);
+ **Embedded web terminal** if [Web Terminal](https://intersystems-community.github.io/webterminal/) is installed in the system;
+ Smart class members grouping, folding and convenient interface, adaptive design;
+ More features!

Preview
-------

![Screenshot 0](https://cloud.githubusercontent.com/assets/4989256/14657296/994c173e-0695-11e6-86b4-ab782eb4c68c.png)

![Screenshot 1](https://cloud.githubusercontent.com/assets/4989256/14295116/efcc9774-fb7c-11e5-86bd-219864fe5634.png)

![Screenshot 2](https://cloud.githubusercontent.com/assets/4989256/14295117/efcf2da4-fb7c-11e5-861f-e9f1231ec909.png)

InterSystems Products Support
-----------------------------

ObjectScript Visual Editor is supported by **InterSystems' products of version 2016.1 and higher**. 

Installation
------------

Download the latest release from [here](https://github.com/intersystems-community/objectscript-visual-editor/releases) and import
XML file into IRIS/Caché/etc by one of the next ways:

- Just drag'n'drop the XML file on the Studio window;
- **OR** Go to the Management Portal -> System Explorer -> Classes -> Import and select the XML file;
- **OR** Execute `do $system.OBJ.Load("C:\path\to\file\FileToImport.xml","ck")` in terminal.

Then check the installation output, it should say "Installation is complete!".

After this, open the next web-application: `http://[host]/VisualEditor/`
(slash at the end is required).

Development
-----------

#### Pre-requirements

To participate in development of this application, you need Git, [NodeJS](https://nodejs.org) and
**InterSystems' Products of version 2016.2+** to be installed (due to UDL import support).

The development process of this application **happens completely outside embedded IDEs** in a form of files. It includes
structured file tree under `source` directory, where each file can be edited in your favorite text
editor.

At first, clone the repository. It contains submodules, so use the `--recursive` flag when cloning:
```bash
git clone --recursive https://github.com/intersystems-community/objectscript-visual-editor
cd objectscript-visual-editor
```

Then you have to install all the project dependencies by running this command from the project's
root:

```bash
npm install
```

And now you are ready to build the project from the sources!

#### Building and testing

This time and each next run this:

```bash
npm run gulp
```

Take your ready to import sources in `build/cache` folder.

#### One-command build and XML export

**To simplify** development on Windows (scripts for other platforms are welcome),
make the copy of `import.bat` file and edit the path to your IRIS/Caché/etc instance there.
Then you can just use one command `import` to deploy the project from source to IRIS/Caché.

After setting `import.bat` up, **just by one command** `import` you get the next:

1. Project is built by Gulp;
2. VisualEditor package is imported into IRIS/Caché;
3. The XML file containing ready-to-deploy package is exported to `build` directory. 
