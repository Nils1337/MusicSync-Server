var http = require("http");
var Library = require('./repo.js').Library;
var Song = require('./repo.js').Song;
var Watcher = require('./watcher.js');

/*http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hello World\n");
}).listen(8081);
*/

Song.sync({force: true});
Library.sync({force: true}).then(() => {
    createLibrary();
});

function createLibrary() {
    Library.create({
        name: 'Library1',
        path: 'music/'
    }).then(()=> {
        createWatcher();
    })
}

function createWatcher() {
    var watcher = []
    Library.findAll().then((libraries) => {
        for (library of libraries) {
            watcher.push(new Watcher(library))
        }
    }) 
}