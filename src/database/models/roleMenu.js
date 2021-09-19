const Sequelize = require('sequelize');
const sequelize = require('../database.js')

const RoleMenu = sequelize.define("RoleMenus", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    message_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    channel_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    color: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    roles: {
        type: Sequelize.TEXT,
        allowNull: true,
    }
});

module.exports = RoleMenu;