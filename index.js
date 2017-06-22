"use strict";
var postcss = require("postcss");
var jlc = require("json-last-commit");
var VERSION = jlc.sync().ahash;
var REGEX_FORMAT = /format(.*)/g;
var REGEX_URL = /\((.*?)\)/;
var defaultOpts = {
    lastCommit: VERSION,
    variable: 'v'
};
/**
 * @desc - Build query url.
 * @return {string} query.
 */
var createQuery = function (variable) { return "?" + variable + "="; };
/**
 * @desc - Build version.
 * @return {number | string} Version.
 */
var getVersion = function () {
    var lastCommit = defaultOpts.lastCommit, version = defaultOpts.version;
    if (version) {
        return version;
    }
    return lastCommit;
};
/**
 * @desc - Build the arguments for building the url.
 * @return {string} Created url.
 */
var getChunksUrl = function (value) {
    var _a = value.match(REGEX_URL)[1].replace(/["']/g, '').split('#'), url = _a[0], link = _a[1];
    var format = (value.match(REGEX_FORMAT) || [])[0];
    var args = { url: url, link: link, format: format };
    return args;
};
/**
 * @desc - Build url.
 * @return {string} Created url.
 */
var createUrl = function (param) {
    var url = param.url, link = param.link, format = param.format;
    var result;
    result = "" + url + createQuery(defaultOpts.variable) + getVersion();
    result = link ? result + "#" + link : result;
    result = "url(\"" + result + "\")";
    result = format ? result + " " + format : result;
    return result;
};
/**
 * @desc - Build url for one url.
 * @return {string} Url.
 */
var oneUrl = function (value) {
    var args = getChunksUrl(value);
    return createUrl(args);
};
/**
 * @desc - Builds the union of many urls.
 * @return {string} Created url.
 */
var moreUrl = function (chunksValue) {
    var urls = chunksValue.map(function (element) {
        var args = getChunksUrl(element);
        return createUrl(args);
    });
    return urls.join(', ');
};
/**
 * @desc - Process for the new value of the url.
 * @return {string} Created url.
 */
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
