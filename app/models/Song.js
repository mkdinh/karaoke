module.exports = (sequelize, DataTypes) => {
    var Song = sequelize.define('Song', {
        song_name: DataTypes.STRING,
        song_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Song
}