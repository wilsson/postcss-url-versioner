# PostCSS Url Versioner [![Build Status][ci-img]][ci]

<img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg">
     
[PostCSS] plugin url versioner.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/wilsson/postcss-url-versioner.svg
[ci]:      https://travis-ci.org/wilsson/postcss-url-versioner

```css
/* Input example */
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
  src: url('webfont.eot?#iefix') format('embedded-opentype'),
       url('webfont.woff2') format('woff2'),
       url('webfont.woff') format('woff'),
       url('webfont.ttf')  format('truetype'),
       url('webfont.svg#svgFontName') format('svg');
}

.myImage{
	background-image: url("/public/img/other/image3.png");
}
```

```css
/* Output example */
@font-face {
  font-family: 'MyWebFont';
  src: url("webfont.eot?v=46cecf7");
  src: url("webfont.eot??v=46cecf7#iefix") format('embedded-opentype'),
       url("webfont.woff2?v=46cecf7") format('woff2'),
       url("webfont.woff?v=46cecf7") format('woff'), 
       url("webfont.svg?v=46cecf7#svgFontName") format('svg');
}

.myImage{
	background-image: url("/public/img/other/image3.png?v=46cecf7");
}
```

## Usage

```js
postcss([ require('postcss-url-versioner') ])
```

## Options

```js
postcss([ 
  require('postcss-url-versioner')({ 
    variable: 'version',
    version: Math.random()
  })
])
```

## Default Options

```js
{
	variable: "v",
	lastCommit: "46cecf7"
}
```

By default it takes abbreviated commit hash.
If you want to place your own version use `version` property.

See [PostCSS] docs for examples for your environment.