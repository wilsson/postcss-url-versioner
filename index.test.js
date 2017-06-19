var postcss = require('postcss');

var plugin = require('./');
var VERSION = '?v=2017612';

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

var tagA = 'a{ background-image:url("./image.png"); }';
// Write tests here

it('does something', () => {
    return run(tagA, 'a{ background-image:url("./image.png'+ VERSION +'"); }', { });
});
