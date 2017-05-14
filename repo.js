const Sequelize = require('sequelize');

var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: 'test.sqlite'
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
        unique: 'uniqueConstraint',
        allowNull: false
    },
    artist: {
        type: Sequelize.STRING,
        unique: 'uniqueConstraint',
        allowNull: false
    },
    album: {
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
    library: {
        type: Sequelize.INTEGER,
        references: {
            model: Library,
            key: 'id'
        }
    }
})

module.exports.Song = Song;
module.exports.Library = Library;
