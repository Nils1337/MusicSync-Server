var express = require('express');
var bodyParser = require('body-parser');
var Library = require('./repo.js').Library;
var Song = require('./repo.js').Song;
var Watcher = require('./watcher.js');
var fs = require('fs');
var path = require('path');
var config = require('./config.js')

var app = express();
/*http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hello World\n");
}).listen(8081);
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router(); 

router.route('/libraries')

    .get((req, res) => {
        Library.findAll().then((libraries) => {
            res.json(libraries);
        })
    })

router.route('/songs')

    .get((req, res) => {
        Song.findAll().then((song) => {
            res.json(song);
        })
    })


router.route('/:library_id/songs')  

    .get((req, res, next) => {
        var library_id = req.params.library_id;
        if (library_id != parseInt(library_id)) {
            next(new Error('library_id must be an integer!'))
        }

        Library.findById(library_id).then((library) => {
            if (!library) {
                next(new Error('library with id ' + library_id + ' does not exist!'))
            }
            else {
                Song.findAll({where: {library: req.params.library_id}}).then((songs) => {
                    res.json(songs);
                })
            }
        })

    })

router.route('/songs/:song_id')

    .get((req, res, next) => {
        var song_id = req.params.song_id;
        if (song_id != parseInt(song_id)) {
            next(new Error('song_id must be an integer!'))
        }

        Song.findById(song_id).then((song) => {
            if (song) res.download(path.join(song.dir, song.filename));
            else next(new Error('song with id ' + song_id + ' does not exist!'));
        })
    })


app.use('/', router);
app.listen(config.port);

Song.sync({force: config.dropSongsOnStart});
Library.sync({force: true}).then(() => {
    var promises = []
    for (library of config.libraries) {
        promises.push(Library.create(library))
    }
    Promise.all(promises).then(function() {
        createWatcher();
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