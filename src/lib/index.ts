import * as postcss from 'postcss';
import * as jlc from 'json-last-commit';

const VERSION = jlc.sync().ahash;

const REGEX_FORMAT = /format(.*)/g;
const REGEX_URL = /\((.*?)\)/;

let defaultOpts: any = {
	lastCommit: VERSION,
	variable : 'v'
};

/**
 * @desc - Build query url.
 * @return {string} query.
 */
let createQuery =  variable => `?${variable}=`;

/**
 * @desc - Build version.
 * @return {number | string} Version.
 */
let getVersion = () => {
	let { lastCommit, version } = defaultOpts;
	if(version){
		return version;
	}
	return lastCommit;
};

/**
 * @desc Url contract
 */
interface Url{
	url: string,
	link: string,
	format: string
}

/**
 * @desc - Build the arguments for building the url.
 * @return {string} Created url.
 */
let getChunksUrl = (value): Url => {
	let [url, link]: string[] = value.match(REGEX_URL)[1].replace(/["']/g, '').split('#');
	let [format]: string[] = value.match(REGEX_FORMAT) || [];
	let args = { url, link, format };
	return args;
};

/**
 * @desc - Build url.
 * @return {string} Created url.
 */
let createUrl = (param): string => {
	let { url, link, format } = param;
	let result: string;
	result = `${url}${createQuery(defaultOpts.variable)}${getVersion()}`;
	result = link ? `${result}#${link}` : result;
	result = `url("${result}")`;
	result = format ? `${result} ${format}`: result;
	return result;
};

/**
 * @desc - Build url for one url.
 * @return {string} Url.
 */
let oneUrl = (value: string): string=> {
	let args = getChunksUrl(value);
	return createUrl(args);
};

/**
 * @desc - Builds the union of many urls.
 * @return {string} Created url.
 */
let moreUrl = (chunksValue: string[]): string => {
	let urls = chunksValue.map(element => {
		let args = getChunksUrl(element);
		return createUrl(args);
	});
	return urls.join(', ');
};

/**
 * @desc - Process for the new value of the url.
 * @return {string} Created url.
 */
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