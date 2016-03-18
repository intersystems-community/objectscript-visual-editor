# Caché Visual Editor (pre-alpha)

A Web-based user interface for InterSystems Caché which allows to create and manage classes
literally without touching any code.

### Preview

![Screenshot 1](https://cloud.githubusercontent.com/assets/4989256/13891951/f52ed7e6-ed5c-11e5-9636-6a9aac876325.png)

![Screenshot 2](https://cloud.githubusercontent.com/assets/4989256/13891950/f52d5574-ed5c-11e5-8377-e9ca1940cd52.png)

### Installation

Find the latest release [here](https://github.com/ZitRos/cache-visual-editor/releases) and import
XML file into Caché by one of the next ways:

1. Just drag XML file over Studio window;
2. Go to the Management Portal -> System Explorer -> Classes -> Import and select the XML file;
3. Execute `do $system.OBJ.Load("C:\path\to\file\FileToImport.xml","ck")` in terminal.

Then check the installation output, it should say "Installation is complete!".

After this, open the next web-application: `http://[host]/VisualEditor/`
(slash at the end is required).

### Development

To participate in development of this application, you have [NodeJS](https://nodejs.org) and Caché 
2016.\* to be installed.

The development process of this application **lies completely outside Caché**. It includes
structured file tree under `source` directory, and each of that files can be edited in your
favorite source editor.

When the source is ready, you need global gulp module to perform builds. Open the command prompt and
install it with one command:

```bash
npm install -g gulp
```

Then you have to install all project dependencies by running this command from the project's root:

```bash
npm install
```

And now you are ready to build the project from the sources! This time and each next run this:

```bash
gulp
```

Take your ready to import sources in `build/cache` folder.

To simplify development on Windows (scripts for other platforms are welcome),
make the copy of `import.bat` file and edit the path to your Caché instance there.
Then you can just use one command `import` (etc) to deploy the project from source to Caché.
