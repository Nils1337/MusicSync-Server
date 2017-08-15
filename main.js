var express = require('express');
var bodyParser = require('body-parser');
var Library = require('./repo.js').Library;
var Song = require('./repo.js').Song;
var Watcher = require('./watcher.js');
var fs = require('fs');
var Path = require('path');
var config = require('./config.js')
const uuid1 = require('uuid/v1')

//var logStream = fs.createWriteStream("console.out", {flags: 'a'})
//process.stdout.pipe(logStream)

var app = express();
var now = new Date(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router(); 

router.route('/libraries')

    .get((req, res) => {
        Library.findAll().then((libraries) => {
            libraries.forEach ((library) => {
                delete library.path
                delete library.updated
            })
            res.json(libraries);
        })
    })

router.route('/songs')

    .get((req, res) => {
        Song.findAll().then((songs) => {
            songs.forEach((song) => {
                delete song.filename
                delete song.updated
                delete song.dir
            })
            res.json(songs);
        })
    })


router.route('/:library_id/songs')  

    .get((req, res, next) => {
        var library_id = req.params.library_id;

        Library.findById(library_id).then((library) => {
            if (!library) {
                next(new Error('library with id ' + library_id + ' does not exist!'))
            }
            Song.findAll({where: {library: req.params.library_id}}).then((songs) => {
                songs.forEach((song) => {
                    delete song.filename
                    delete song.updated
                    delete song.dir
                })
                res.json(songs);
            })
        })

    })

router.route('/songs/download/:song_id')

    .get((req, res, next) => {
        var song_id = req.params.song_id;
        Song.findById(song_id).then((song) => {
            if (!song) {
                next(new Error('song with id ' + song_id + ' does not exist!'))
            }
            res.download(Path.join(song.dir,song.filename))
        })
    })

app.use('/', router);
app.listen(config.port);

if (config.debug) {
    console.log("Starting Song sync");
}
Song.sync({force: config.dropSongsOnStart}).then(() => {
    if (config.debug) {
        console.log("Finished Song sync");
    }
});

if (config.debug) {
    console.log("Starting Library sync");
}
Library.sync({force: config.dropLibrariesOnStart}).then(() => {

    if (config.debug) {
        console.log("Finished Library sync")
    }
    var promises = []
    for (library of config.libraries) {
        promises.push(updateOrCreateLibrary(library))
    }
    Promise.all(promises).then(function() {
        Library.findAll({where: {
             updated: {
                 $lt: now
            }
        }}).then((libraries) => {
            for (library of libraries) {
                 library.destroy();
            }
            createWatcher();
         })
    })
});

function createWatcher() {
    var watcher = []
    Library.findAll().then((libraries) => {
        for (library of libraries) {
            watcher.push(new Watcher(library))
        }
    }) 
}

function updateOrCreateLibrary(configLibrary) {
    return Library.findOne({where: {path: configLibrary.path}}).then((library) => {
        if (library) {
            return library.update(libraryObject(configLibrary, library.id))
        }
        else {
            return Library.create(libraryObject(configLibrary, null))
        }
    })
}

function libraryObject(configLibrary, id) {
    if (!id) {
        id = uuid1()
    }
    return {
        id: id,
        name: configLibrary.name,
        path: configLibrary.path,
        updated: new Date()
    }
}