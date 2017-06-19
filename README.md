# PostCSS Url Versioner [![Build Status][ci-img]][ci]
In progess
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
  src: url("webfont.eot?v=2017612");
  src: url("webfont.eot??v=2017612#iefix") format('embedded-opentype'), 
	   url("webfont.woff2?v=2017612") format('woff2'), 
       url("webfont.ttf?v=2017612") format('truetype'), 
       url("webfont.svg?v=2017612#svgFontName") format('svg');
}
.myImage{
	background-image: url("/public/img/other/image3.png?v=2017612");
}
```

## Usage

```js
postcss([ require('postcss-url-versioner') ])
```

See [PostCSS] docs for examples for your environment.