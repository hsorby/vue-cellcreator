============
Cell Creator
============

Project setup
=============
```
npm install
```

Compiles and hot-reloads for development
----------------------------------------
```
npm run serve
```

Compiles and minifies for production
------------------------------------
```
npm run build
```

Lints and fixes files
---------------------
```
npm run lint
```

Customize configuration
-----------------------
See [Configuration Reference](https://cli.vuejs.org/config/).

libCellML
---------

Add libCellML javascript library and wasm files to `src/js/model` directory.

When linking the libCellML javascript binaries for development work also add the following lint file
to the directory where the libCellML javascript binaries exist::

  module.exports = {
        parserOptions : {
                ecmaVersion: 6,
                sourceType: module
        }
  };

File seems to work most of the time.  Sometimes need to remove `sourceType` line restart server and then add the line back in again.

