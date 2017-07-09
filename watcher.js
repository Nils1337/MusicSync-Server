var chokidar = require('chokidar');
var fs = require('fs');
var Path = require('path');
var Song = require('./repo.js').Song;
var mm = require('music-metadata');
var Promise = require('bluebird');
const uuid1 = require('uuid/v1')
var config = require('./config.js')

var now;

var Watcher = function(library) {
    this.library = library;
    var path = library.path;
    if (path.charAt(path.length - 1) == '/') {
        path = path.concat('**/*.mp3');
    }
    else {
        path = path.concat('/**/*.mp3');
    }

    now = new Date();
    adding = 0;
    var watcher = chokidar.watch(path, {ignored: /(^|[\/\\])\../})

    watcher.on('add', onAdd);
    watcher.on('change', onChange);
    watcher.on('unlink', onDelete);
    watcher.on('ready', () => {
        //delete all songs not updated during initial scan
        //but wait for all add events to be processed
        Promise.delay(config.deleteDelay).then(() => {
            Song.findAll({where: {
                updated: {
                    $lt: now
                }
            }}).then((songs) => {
                for (song of songs) {
                    song.destroy();
                }
            })
        })
    })


    function onAdd(path, info) {
        return Song.findOne({where: {dir: Path.dirname(path), filename: Path.basename(path)}}).then((song) => {
            if (song) {
                var stats = fs.statSync(path);

                var fsMtime = new Date(stats.mtime);
                var dbMtime = new Date(song.updated);

                if (fsMtime > dbMtime) {
                    saveMetadata(path, true, song);
                }
                else {
                    //reset updated time
                    song.updated = new Date();
                    song.save();
                }
            }
            else {
                saveMetadata(path, false);
            }
        })
    }

    function onChange(path, info) {
        Song.findOne({where: {dir: Path.dirname(path), filename: Path.basename(path)}}).then((song)=> {
            if (song) {
                saveMetadata(path, true, song);
            }
        })
    }

    function onDelete(path, info) {
        Song.findOne({where: {dir: Path.dirname(path), filename: Path.basename(path)}}).then((song) => {
            if (song) song.destroy();
        })
    }

    function saveMetadata(path, update, song) {
        var stream = fs.createReadStream(path);

        stream.on('error', (err) => {
            console.log('Error occured during reading \'' + path * '\'\n' + err);
            stream.close();
        })

        mm.parseStream(stream, function (err, metadata) {
            if (err) {
                console.error('Error occured while parsing ' + path + '\n' + err);
                return;
            }
            stream.close();
            if (update) {
                updateSong(song, metadata, path)         
            }
            else {
                createSong(metadata, path)
            }
        })
    }
    
    function updateSong(song, metadata, path) {
        song.update(newSong(metadata, path));
    }

    function createSong(metadata, path) {
        Song.create(newSong(metadata, path));
    }

    function newSong(metadata, path) {
        var picture;
        if (metadata.common.picture) {
            picture = metadata.common.picture[0]
        }
        return {
            id: uuid1(),
            artist: metadata.common.artists[0],
            title: metadata.common.title,
            album: metadata.common.album,
            albumArtist: metadata.common.albumartist,
            tracknr: metadata.common.track.no,
            tracks: metadata.common.track.of,
            year: metadata.common.year,
            duration: metadata.format.duration,
            dir: Path.dirname(path),
            filename: Path.basename(path),
            picture: picture,
            library: library.id,
            updated: new Date(),
        }
    }
}


module.exports = Watcher;

