# Gulp Tools for Mr. Poole

[![NPM version][npm-image]][npm-url] [![License MIT][license-image]][license-url] [![Downloads][downloads-image]][npm-url]

Gulp tasks for the [Mr. Poole Jekyll Generator](https://github.com/iamcarrico/gulp-poole), and can be used on any Jekyll site.

## Usage

Install into your local repository.

```bash
$ npm install gulp-poole --save-dev
```

Put in your local gulpfile:

```js
'use strict';

var gulp = require('gulp');
require('gulp-poole')(gulp);
```

### Settings

Settings can be overriden within a local ```poole.json``` file. More details on the tools available soon.


### Tasks

To compile all of our Sass files using compass, use:

```bash
$ gulp sass
```

To ensure all of our images are optimized:

```bash
$ gulp images
```

To build our Jekyll site, and serve it using BrowserSync. This will watch our files and ensure the proper tasks are run for us on their change. It will also automatically update our site, without the need for a refresh, all through BrowserSync.

```bash
$ gulp server
```

To build our site for production, and save the result in '_site':

```bash
$ gulp build
```

To build the site for production, and deploy that code to our gh-pages branch for us:

```bash
$ gulp deploy
```


## License

MIT

[downloads-image]: http://img.shields.io/npm/dm/gulp-poole.svg
[npm-url]: https://npmjs.org/package/gulp-poole
[npm-image]: http://img.shields.io/npm/v/gulp-poole.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/iamcarrico/gulp-poole/blob/master/LICENSE
