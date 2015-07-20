var path = require('path');
var spawn = require('win-spawn');
var through = require('through2');
var haml = require('gulp-ruby-haml');

var extensions = ['.haml'];

module.exports = function (b, opts) {
    if (extensions.indexOf(path.extname(b)) === -1) {
        return through();
    }

    var input = '';
    function read(data, encoding, callback) {
        input += data;
        callback();
    }

    function end() {
        var options = {};
        options.doubleQuote = false;
        options.require = false;

        var args = ['haml'];
        args.push('-s');
        if (options.doubleQuote) {
            args.push('-q');
        }
        if (options.require) {
            args.push('-r');
            args.push(options.require);
        }

        var cp = spawn(args.shift(), args);

        var haml_data = '';
        cp.stdout.on('data', function (data) { haml_data += data.toString(); });

        cp.stdin.write(input);
        cp.stdin.end();

        this.push(haml_data);
        this.push(null);
    }

    return through(read, end);
};