import * as postcss from 'postcss';
import * as jlc from 'json-last-commit';

const VERSION = jlc.sync().ahash;

const REGEX_FORMAT = /format(.*)/g;
const REGEX_URL = /\((.*?)\)/;

let defaultOpts = {
    lastCommit: VERSION,
    variable : 'v',
    version:12
};

let createQuery =  variable => `?${variable}=`;

/*
let verifyVersion = () => {
    let version: string;
    let { lastCommit, version } = defaultOpts;
    if(lastCommit){
        version = lastCommit;
        return version
    }
    version = version;
    return version;
};
*/
interface Url{
    url: string,
    link: string,
    format: string
}

let getChunksUrl = (value): Url => {
    let [url, link] = value.match(REGEX_URL)[1].replace(/["']/g, '').split('#');
    let [format] = value.match(REGEX_FORMAT) || [];
    let args = { url, link, format };
    return args;
};

let createUrl = (param): string => {
    let { url, link, format } = param;
    let result: string;
    result = `${url}${createQuery(defaultOpts.variable)}${defaultOpts.lastCommit}`;
    result = link ? `${result}#${link}` : result;
    result = `url("${result}")`;
    result = format ? `${result} ${format}`: result;
    return result;
};

let oneUrl = (value: string): string=> {
    let args = getChunksUrl(value);
    return createUrl(args);
};

let moreUrl = (chunksValue: string[]): string => {
    let urls = chunksValue.map(element => {
        let args = getChunksUrl(element);
        return createUrl(args);
    });
    return urls.join(', ');
};

let convertUrl = (value: string): string => {
    let chunksValue: string[];  
    chunksValue = value.split(',');
    if (chunksValue.length > 1) {
        return moreUrl(chunksValue);
    }
    return oneUrl(value);
};

export = postcss.plugin('postcss-url-versioner', (opts) => {
    (<any>Object).assign(defaultOpts, opts);
    console.log("defaultOpts>", defaultOpts);
    // Work with options here
    return root => {
        // Transform CSS AST here
        root.walkDecls(decl => {
            if (decl.value.indexOf('url(') !== -1) {
                decl.value = convertUrl(decl.value);
            }
        });
    };
});