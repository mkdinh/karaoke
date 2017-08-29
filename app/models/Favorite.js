module.exports = (sequelize, DataTypes) => {
    var Favorite = sequelize.define('Favorite', {
        song_name: DataTypes.STRING,
        song_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        img_url: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    return Favorite;
}