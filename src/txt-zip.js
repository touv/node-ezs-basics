import zlib from 'zlib';
import { PassThrough } from 'stream';

function TXTZip(data, feed) {
    if (this.isFirst()) {
        this.output = new PassThrough();
        this.input = new PassThrough();
        this.gzip = zlib.createGzip();
        this.input.pipe(this.gzip).pipe(this.output);
        this.output.on('data', d => feed.send(d));
        this.output.on('finish', () => feed.close());
    }

    if (this.isLast()) {
        return this.input.end();
    }

    if (!this.input.write(data)) {
        this.input.once('drain');
    }
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
