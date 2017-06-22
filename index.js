"use strict";
var postcss = require("postcss");
var jlc = require("json-last-commit");
var VERSION = jlc.sync().ahash;
var REGEX_FORMAT = /format(.*)/g;
var REGEX_URL = /\((.*?)\)/;
var defaultOpts = {
    lastCommit: VERSION,
    variable: 'v',
    version: 12
};
var createQuery = function (variable) { return "?" + variable + "="; };
var getChunksUrl = function (value) {
    var _a = value.match(REGEX_URL)[1].replace(/["']/g, '').split('#'), url = _a[0], link = _a[1];
    var format = (value.match(REGEX_FORMAT) || [])[0];
    var args = { url: url, link: link, format: format };
    return args;
};
var createUrl = function (param) {
    var url = param.url, link = param.link, format = param.format;
    var result;
    result = "" + url + createQuery(defaultOpts.variable) + defaultOpts.lastCommit;
    result = link ? result + "#" + link : result;
    result = "url(\"" + result + "\")";
    result = format ? result + " " + format : result;
    return result;
};
var oneUrl = function (value) {
    var args = getChunksUrl(value);
    return createUrl(args);
};
var moreUrl = function (chunksValue) {
    var urls = chunksValue.map(function (element) {
        var args = getChunksUrl(element);
        return createUrl(args);
    });
    return urls.join(', ');
};
var convertUrl = function (value) {
    var chunksValue;
    chunksValue = value.split(',');
    if (chunksValue.length > 1) {
        return moreUrl(chunksValue);
    }
    return oneUrl(value);
};
module.exports = postcss.plugin('postcss-url-versioner', function (opts) {
    Object.assign(defaultOpts, opts);
    console.log("defaultOpts>", defaultOpts);
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
