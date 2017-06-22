var postcss = require('postcss');
var jlc = require("json-last-commit");

var plugin = require('./');
var variable = 'version';
var version = '?'+ variable + "=" +jlc.sync().ahash;

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

var tagA = 'a{ background-image:url("./image.png"); }';
// Write tests here

console.log("jlc>", version);

it('does something', () => {
    return run(tagA, 'a{ background-image:url("./image.png'+ version +'"); }', {
        variable: variable
     });
});
