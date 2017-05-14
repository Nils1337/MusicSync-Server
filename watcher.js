var chokidar = require('chokidar');
var fs = require('fs');
var Song = require('./repo.js').Song;
var mm = require('music-metadata');
var Util = require('./util.js');

var Watcher = function(library) {
    var path = library.path.slice(0);
    if (path.charAt(path.length - 1) == '/') {
        path.concat('**/*.mp3');
    }
    else {
        path.concat('/**/*.mp3');
    }
    var watcher = chokidar.watch(path, {ignored: /(^|[\/\\])\../})

    watcher.on('add', onAdd);
}

function onAdd(path, info) {
 
     Song.findOne({where: {dir: Util.getDirFromFullPath(path), filename: Util.getFilenameFromFullPath(path)}}).then((song)=> {
        if (song) {
            var stats = fs.statSync(path);

            var fsMtime = new Date(stats.mtime);
            var dbMtime = new Date(song.updatedAt);

            if (fsMtime > dbMtime) {
                var stream = fs.createReadStream(path);

                stream.on('error', (err) => {
                    console.log('Error occured during reading \'' + path * '\'\n' + err);
                    stream.close();
                })

                mm.parseStream(stream, function (err, metadata) {
                    if (err) {
                        console.error('Error occured while parsing' + path + '\n' + err);
                        return;
                    }
                    stream.close();
                    updateSong(song, metadata, path);
                })

            }
        }
        else {
            var stream = fs.createReadStream(path);

            stream.on('error', (err) => {
                console.log('Error occured during reading \'' + path * '\'\n' + err);
                stream.close();
            })

            mm.parseStream(stream, function (err, metadata) {
                if (err) {
                    console.error('Error occured while parsing' + path + '\n' + err);
                    return;
                }
                stream.close();
                console.log(metadata);                       
                createSong(metadata, path);
            })
         
        }
    })
 

}

function openMetadataStream(bool) {
}

function updateSong(song, metadata, path) {
    song.update(newSong(metadata, path));
}

function createSong(metadata, path) {
    Song.create(newSong(metadata, path));
}

function newSong(metadata, path) {
    return {
        artist: metadata.common.artists[0],
        title: metadata.common.title,
        dir: Util.getDirFromFullPath(path),
        filename: Util.getFilenameFromFullPath(path)
    }
}


module.exports = Watcher;

