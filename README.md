# Gulp Tools for Mr. Poole

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![License MIT][license-image]][license-url] [![Downloads][downloads-image]][npm-url]

```
.___  ___. .______                    _-----_
|   \/   | |   _  \                   | - - |
|  \  /  | |  |_)  |                  |  ω  |
|  |\/|  | |      /                   | ___ |
|  |  |  | |  |\  \     __          __'.___.'__
|__|  |__| | _| `._\   (__)        ´    >-<    `

.______     ______     ______    __       _______
|   _  \   /  __  \   /  __  \  |  |     |   ____|
|  |_)  | |  |  |  | |  |  |  | |  |     |  |__
|   ___/  |  |  |  | |  |  |  | |  |     |   __|
|  |      |  `--'  | |  `--'  | |  `----.|  |____
| _|       \______/   \______/  |_______||_______|
```

For the Yeoman generator that set's up a Jekyll site for you, check out [Mr. Poole, the Jekyll Site Generator](https://github.com/iamcarrico/generator-poole/).

Gulp tasks for the [Mr. Poole Jekyll Generator](https://github.com/iamcarrico/generator-poole), and can be used on any Jekyll site.

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

## Required files

For these tools to work you MUST create a ```_config.dev.yml```. You can use this to override any settings for local development that you do not want for deployment. For example, you can prevent jekyll-assets from uglifying your JavaScript by overriding the setting.

### Settings

Settings can be overridden within a local ```poole.json``` file. Create a file called "poole.json" that has the following settings. These are all the defaults that are possible, change any of them as needed. (e.g. if you want to deploy to a different remote, alter `deploy-remote`.)

```json
{
  "deploy-remote": "origin",
  "deploy-branch": "gh-pages",
  "imagesSrc": "_images",
  "assets": "_site/assets",
  "jekyll": [
    "**/*.html",
    "**/*.md",
    "!_site/**/*.html",
    "!node_modules/**/*"
  ]
}
```


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

To build our site for production, and save the result in ```_site```:

```bash
$ gulp build
```

To build the site for production, and deploy that code to our gh-pages branch for us:

```bash
$ gulp deploy
```


## License

MIT


[travis-url]: https://travis-ci.org/iamcarrico/gulp-poole
[travis-image]: http://img.shields.io/travis/iamcarrico/gulp-poole.svg

[downloads-image]: http://img.shields.io/npm/dm/gulp-poole.svg
[npm-url]: https://npmjs.org/package/gulp-poole
[npm-image]: http://img.shields.io/npm/v/gulp-poole.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/iamcarrico/gulp-poole/blob/master/LICENSE
