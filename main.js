var http = require("http");
var Library = require('./repo.js').Library;
var Song = require('./repo.js').Song;
var Watcher = require('./watcher.js');

/*http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hello World\n");
}).listen(8081);
*/

var dropTables = true;

Song.sync({force: dropTables});
Library.sync({force: dropTables}).then(() => {
    createWatcher();
});

function createLibrary(name) {
    return Library.create({
        name: name,
        path: 'music/' + name
    })
}

function createWatcher() {
    var watcher = []
    Library.findAll().then((libraries) => {
        if (libraries.length == 0) {
            createLibrary("Library1").then(() => {
                createLibrary("Library2").then(() => {
                    createWatcher();
                })
            })
        }
        else {
            for (library of libraries) {
                watcher.push(new Watcher(library))
            }
        }
    }) 
}