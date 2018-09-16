
const {tokenize, sentTokenize} = require('../src/index');

describe('tokenize', () => {
    test('splits and lowercases', () => {
        const tokenized = tokenize('This is how we do it.');
        expect(tokenized[0]).toBe('this');
        expect(tokenized[tokenized.length - 1]).toBe('.');
        expect(tokenized.length).toEqual(7);
    });

    test('splits sentences', () => {
        const sentTokenized = sentTokenize("This is how we do it. It's Friday night, and I feel" +
            " all right, and the party's here on the west side. So I reach for my 40 and I turn it " +
            "up. Designated driver take the keys to my truck.");
        expect(sentTokenized.length).toEqual(4);
    });

    test('empty texts', () => {
        const tokenized = tokenize('');
        expect(Array.isArray(tokenized)).toBe(true);
        expect(tokenized.length).toEqual(0);
        
        const sentTokenized = sentTokenize('');
        expect(Array.isArray(sentTokenized)).toBe(true);
        expect(sentTokenized.length).toEqual(0);
    });
});
