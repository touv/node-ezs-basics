import zlib from 'zlib';

function TXTZip(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    zlib.deflate(data, (err, buffer) => {
        if (err) { return feed.stop(err); }
        feed.write(buffer);
        return feed.end();
    });
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
