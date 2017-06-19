var postcss = require('postcss');
var VERSION = '?v=2017612';

function createUrl(value) {
    var url = 'url(\"' + value + '\")';
    return url;
}

function moreUrl(chunksValue) {
    var urls = chunksValue.map(function (element) {
        var url;
        var chunksUrl = element.match(/url\((.*)\)[^format]/)[1].replace(/["']/g, '').split('#');
        var chunkFormat = element.match(/format(.*)/g);
        if (chunksUrl.length > 1) {
            url = createUrl(chunksUrl[0] + VERSION + '#' + chunksUrl[1]);
            url = url + ' ' + chunkFormat;
            return url;
        }
        url = createUrl(chunksUrl + VERSION) + ' ' + chunkFormat;
        return url;
    });
    return urls.join(',');
}
function oneUrl(value) {
    var url =  value.match(/url\((.*)\)/)[1].replace(/["']/g, '') + VERSION;
    url = createUrl(url);
    return url;
}

function convertUrl(value) {
    var chunksValue = value.split(',');
    if (chunksValue.length > 1) {
        return moreUrl(chunksValue);
    }
    return oneUrl(value);
}

module.exports = postcss.plugin('postcss-url-versioner', function (opts) {
    opts = opts || {};

    // Work with options here
    return function (root) {
        // Transform CSS AST here
        root.walkDecls(function (decl) {
            if (decl.value.indexOf('url(') !== -1) {
                decl.value = convertUrl(decl.value);
            }
        });
    };
});
