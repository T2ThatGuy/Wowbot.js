const Sequelize = require("sequelize");

const sequelize = new Sequelize('database', 'root', '12345', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './src/database/database.sqlite',
});

module.exports = sequelize;