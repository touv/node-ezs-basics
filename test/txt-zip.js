const assert = require('assert');
const from = require('from');
const ezs = require('ezs');
const pako = require('pako');

ezs.use(require('../lib'));

describe('txt-zip', () => {
    it('should zip a stream containing a string', (done) => {
        let length = 0;
        const input = 'Ahahahaha this is a longer string, to see if it\'s more efficient!';
        from([input])
            .pipe(ezs('TXTZip'))
            .on('data', (chunk) => {
                length += chunk.length;
            })
            .on('end', () => {
                assert.ok(input.length >= length);
                done();
            })
            .on('error', done);
    });

    it('should zip a stream containing two strings', (done) => {
        let length = 0;
        const input1 = 'Ahahahaha this is a longer string, to see if it\'s more efficient!';
        const input2 = 'And this is the second string, that should be long to see a compression rate.';
        from([input1, input2])
            .pipe(ezs('TXTZip'))
            .on('data', (chunk) => {
                length += chunk.length;
            })
            .on('end', () => {
                assert.ok(input1.length + input2.length >= length);
                done();
            })
            .on('error', done);
    });

    it('should be unzippable', (done) => {
        const inflate = new pako.Inflate();

        const input1 = 'Ahahahaha this is a longer string, to see if it\'s more efficient!';
        const input2 = 'And this is the second string, that should be long to see a compression rate.';
        from([input1, input2])
            .pipe(ezs('TXTZip'))
            .on('data', (chunk) => {
                inflate.push(chunk);
            })
            .on('end', () => {
                inflate.push(null, true);
                const output = inflate.result;
                assert.strictEqual(output.length, input1.length + input2.length);
                assert.strictEqual(String.fromCharCode(...output), input1 + input2);
                done();
            })
            .on('error', done);
    });

    it('should preserve Unicode', (done) => {
        const inflate = new pako.Inflate();

        const input1 = 'Ahahahaha je fais une chaîne assez longue pour constater une compression.';
        const input2 = 'Et ça c\'est la seconde chaîne, avec des accents insérés, pour vérifier l\'encodage.';
        from([input1, input2])
            .pipe(ezs('TXTZip'))
            .on('data', (chunk) => {
                inflate.push(chunk);
            })
            .on('end', () => {
                inflate.push(null, true);
                const output = inflate.result;
                assert.strictEqual(String.fromCharCode(...output), input1 + input2);
                done();
            })
            .on('error', done);
    });
});
