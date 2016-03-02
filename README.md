# Caché Visual Builder

A Web-based user interface for InterSystems Caché which allows to create and manage classes
literally without touching any code.

### Development

To participate in development of this application, you have [NodeJS](https://nodejs.org) and Caché 
2016.\* to be installed.

The development process of this application **lies completely outside Caché**. It includes
structured file tree under `source` directory, and each of that files can be edited in your
favorite text editor.

When the source is ready, you need global gulp module to perform builds. Open the command prompt and
install it with one command:

```bash
npm install -g gulp
```

Then you have to install all project dependencies by running this command:

```bash
npm install
```

And now you are ready to build the project from the sources! This time and each next run this:

```bash
gulp
```

And take your ready to import sources in `build/cache` folder.

Note that all the sources are plaintext \*.cls files which currently may be imported
**only through Atelier** in Caché 2016.\* and higher. _If you have discovered a way to import \*.cls
files into the studio except of using Atelier UI, please, create an issue and describe the method._