const Sequelize = require('sequelize');
var config = require('./config.js')

var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: config.dbFileName
})

var Library = sequelize.define('library', {
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    path: {
        type: Sequelize.STRING
    }
})

var Song = sequelize.define('song', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    artist: {
        type: Sequelize.STRING,
        allowNull: false
    },
    album: {
        type: Sequelize.STRING
    },
    albumArtist: {
        type: Sequelize.STRING
    },
    dir: {
        type: Sequelize.STRING,
        allowNull: false
    },
    filename: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tracknr: {
        type: Sequelize.INTEGER
    },
    tracks: {
        type: Sequelize.INTEGER
    },
    year: {
        type: Sequelize.INTEGER
    },
    duration: {
        type: Sequelize.INTEGER
    },
    picture: {
        type: Sequelize.BLOB
    },
    library: {
        type: Sequelize.INTEGER,
        references: {
            model: Library,
            key: 'id'
        }
    },
    updated: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false
})

module.exports.Song = Song;
module.exports.Library = Library;
