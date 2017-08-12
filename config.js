var config = {}

config.debug = false;
config.port = 80;
config.protocol = "http";
config.dbFileName = "songs.sqlite"
config.dropSongsOnStart = false;
config.dropLibrariesOnStart = false;
config.deleteDelay = 30 * 1000;

config.libraries = [];
config.libraries.push({
    name: "Library1",
    path: "/app/music/library1"
})

config.libraries.push({
    name: "Library2",
    path: "/app/music/library2"
})

module.exports = config;