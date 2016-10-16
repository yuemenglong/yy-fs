var fs = require("fs");
var P = require("path");
var _ = require("lodash");

_.merge(exports, fs);

exports.mkdirSync = function(path) {
    function mkdirSync(path) {
        try {
            var stat = fs.statSync(path);
        } catch (ex) {
            mkdirSync(P.dirname(path));
            fs.mkdirSync(path);
            return;
        }
        if (!stat.isDirectory()) {
            throw new Error("${path} Exists And Is Not Directory");
        }
        return;
    }
    mkdirSync(path);
}

exports.unlinkSync = function(path) {
    try {
        var stat = fs.statSync(path);
    } catch (ex) {
        return;
    }
    if (stat.isFile()) {
        return fs.unlinkSync(path);
    }
    if (stat.isDirectory()) {
        return unlinkDirSync(path);
    }

    function unlinkDirSync(dir) {
        fs.readdirSync(dir).map(function(name) {
            var subPath = P.resolve(dir, name);
            var stat = fs.statSync(subPath);
            if (stat.isFile()) {
                return fs.unlinkSync(subPath);
            }
            if (stat.isDirectory()) {
                unlinkDirSync(subPath);
            }
        })
        fs.rmdirSync(dir);
    }
}

exports.writeFileSync = function(path, content) {
    exports.mkdirSync(P.dirname(path));
    fs.writeFileSync(path, content);
}
