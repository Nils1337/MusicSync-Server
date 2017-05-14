
function Util() {}

Util.getFilenameFromFullPath = function(fullPath) {
    var i = fullPath.lastIndexOf('/');
    if (i > -1) {
        return fullPath.substring(i + 1);
    }
    return fullPath;
}

Util.getDirFromFullPath = function(fullPath) {
    var i = fullPath.lastIndexOf('/');
    if (i > -1) {
        return fullPath.substring(0, i);
    }
    return fullPath;
}
module.exports = Util;
