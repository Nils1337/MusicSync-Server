var config = {}

config.debug = true;
config.port = 80;
config.protocol = "http";
config.dbFileName = "songs.sqlite"
config.dropSongsOnStart = false;
config.dropLibrariesOnStart = false;
config.deleteDelay = 30 * 1000;

config.libraries = [];
config.libraries.push({
    name: "Library1",
    path: "C:/Users/nilsa/AppProject/music/library1/"
})

config.libraries.push({
    name: "Library2",
    path: "C:/Users/nilsa/AppProject/music/library2/"
})

module.exports = config;