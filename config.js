var config = {}

config.port = 8080;
config.protocol = "http";
config.dbFileName = "songs.sqlite"
config.dropSongsOnStart = false;
config.deleteDelay = 30 * 1000;

config.libraries = [];
config.libraries.push({
    name: "Library1",
    path: "music/library1"
})

config.libraries.push({
    name: "Library2",
    path: "music/library2"
})

module.exports = config;