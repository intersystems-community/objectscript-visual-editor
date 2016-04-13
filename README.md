# Caché Visual Editor (pre-alpha)

A Web-based user interface for InterSystems Caché which allows to create and manage classes
literally without touching any code.

### Preview

![Screenshot 0](https://cloud.githubusercontent.com/assets/4989256/14316622/be325704-fc0c-11e5-93f0-a7cc0b9116f6.png)

![Screenshot 1](https://cloud.githubusercontent.com/assets/4989256/14295116/efcc9774-fb7c-11e5-86bd-219864fe5634.png)

![Screenshot 2](https://cloud.githubusercontent.com/assets/4989256/14295117/efcf2da4-fb7c-11e5-861f-e9f1231ec909.png)

### Caché Support
Caché Visual Editor is supported by **Caché version 2016.1 and higher**. 

### Installation

Download the latest release from [here](https://github.com/ZitRos/cache-visual-editor/releases) and import
XML file into Caché by one of the next ways:

1. Just drag XML file over Studio window;
2. Go to the Management Portal -> System Explorer -> Classes -> Import and select the XML file;
3. Execute `do $system.OBJ.Load("C:\path\to\file\FileToImport.xml","ck")` in terminal.

Then check the installation output, it should say "Installation is complete!".

After this, open the next web-application: `http://[host]/VisualEditor/`
(slash at the end is required).

### Development

##### Pre-requirements

To participate in development of this application, you need Git, [NodeJS](https://nodejs.org) and
**Caché 2016.2+** to be installed (due to UDL import support).

The development process of this application **lies completely outside Caché**. It includes
structured file tree under `source` directory, where each file can be edited in your favorite text
editor.

At first, clone the repository. It contains submodules, so use the `--recursive` flag when cloning:
```bash
git clone --recursive https://github.com/intersystems-ru/cache-visual-editor
cd cache-visual-editor
```

Then you have to install all the project dependencies by running this command from the project's
root:

```bash
npm install
```

And now you are ready to build the project from the sources! This time and each next run this:

```bash
npm run gulp
```

Take your ready to import sources in `build/cache` folder.

**To simplify** development on Windows (scripts for other platforms are welcome),
make the copy of `import.bat` file and edit the path to your Caché instance there.
Then you can just use one command `import` to deploy the project from source to Caché.

##### Building and testing

After setting `import.bat` up, **just by one command** `import` you get the next:

1. Project is built by gulp;
2. VisualEditor package is imported into Caché;
3. The XML file containing ready-to-deploy package is exported to `build` directory. 