<h1 align="center">Pamela</h1>

Pamela is an HTML5 Canvas JavaScript framework that enables high performance animations, transitions, node nesting, layering, filtering, caching, event handling for desktop and mobile applications, and much more.

You can draw things onto the stage, add event listeners to them, move them, scale them, and rotate them independently from other shapes to support high performance animations, even if your application uses thousands of shapes. Served hot with a side of awesomeness.

This repository began as a GitHub fork of KonvaJS

# Quick Look

```html
<div id="container"></div>
<script>
    import Pamela from '@revodigital/pamela'
  var stage = new Pamela.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // add canvas element
  var layer = new Pamela.Layer();
  stage.add(layer);

  // create shape
  var box = new Pamela.Rect({
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true,
  });
  layer.add(box);

  // add cursor styling
  box.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  box.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });
</script>
```

# Browsers support

Pamela works in all modern mobile and desktop browsers. A browser need to be capable to run javascript code from ES2015 spec. For older browsers you may need polyfills for missing functions.

At the current moment `Pamela` doesn't work in IE11 directly. To make it work you just need to provide some polyfills such as `Array.prototype.find`, `String.prototype.trimLeft`, `String.prototype.trimRight`, `Array.from`.

# Loading and installing Pamela

Pamela supports UMD loading. So you can use all possible variants to load the framework into your project:

### Install with npm:

```bash
npm install @revodigital/pamela --save
```

```javascript
// The modern way (e.g. an ES6-style import for webpack, parcel)
import Pamela from '@revodigital/pamela';
```

#### Typescript usage
Pamela includes by default **typescript** typings, to allow
tsc to compile it.

### CommonJS modules
By default, **Pamela** is brought to you using 
a commonjs module.

# Change log

See [CHANGELOG.md](https://github.com/Pamelajs/Pamela/blob/master/CHANGELOG.md).

## Building the Pamela Framework
Since **Pamela** is written in typescript, you can simply run
```
tsc
```
To produce all compiled js files. Then you can publish it
using 
```
npm publish
```

## Testing

Pamela uses Mocha for testing.

- If you need run test only one time run `npm run test`.
- While developing it is easy to use `npm start`. Just run it and go to [http://localhost:8080/test/runner.html](http://localhost:8080/test/runner.html). The watcher will rebuild the bundle on any change.

Pamela is covered with hundreds of tests and well over a thousand assertions.
Pamela uses TDD (test driven development) which means that every new feature or bug fix is accompanied with at least one new test.

## Generate documentation

Run `npx gulp api` which will build the documentation files and place them in the `api` folder.

# Pull Requests

I'd be happy to review any pull requests that may better the Pamela project,
in particular if you have a bug fix, enhancement, or a new shape (see `src/shapes` for examples). Before doing so, please first make sure that all of the tests pass (`gulp lint test`).

## Contributors

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/Pamela/contribute)]

#### Individuals

<a href="https://opencollective.com/Pamela"><img src="https://opencollective.com/Pamela/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/Pamela/contribute)]

<a href="https://opencollective.com/Pamela/organization/0/website"><img src="https://opencollective.com/Pamela/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/1/website"><img src="https://opencollective.com/Pamela/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/2/website"><img src="https://opencollective.com/Pamela/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/3/website"><img src="https://opencollective.com/Pamela/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/4/website"><img src="https://opencollective.com/Pamela/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/5/website"><img src="https://opencollective.com/Pamela/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/6/website"><img src="https://opencollective.com/Pamela/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/7/website"><img src="https://opencollective.com/Pamela/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/8/website"><img src="https://opencollective.com/Pamela/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/Pamela/organization/9/website"><img src="https://opencollective.com/Pamela/organization/9/avatar.svg"></a>
