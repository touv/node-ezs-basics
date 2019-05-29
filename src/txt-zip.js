import pako from 'pako';

function TXTZip(data, feed) {
    if (this.isLast()) {
        this.deflator.push('', true);
        return;
    }
    if (this.isFirst()) {
        this.deflator = new pako.Deflate({ level: 9, to: 'string', gzip: true, header: { text: true } });
        this.deflator.onData = chunk => feed.write(chunk);
        this.deflator.onEnd = () => feed.close();
    }
    this.deflator.push(Buffer.from(data, 'binary'), false);
    feed.end();
}

/**
 * Take a String and zip it
 *
 * @name TXTZip
 * @returns {Buffer}
 */
export default {
    TXTZip,
};
