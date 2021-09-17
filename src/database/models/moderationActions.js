const Sequelize = require('sequelize');
const sequelize = require('../database.js')

const ModActions = sequelize.define("ModerationActions", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    modName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    modId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    targetName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    targetId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    reason: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = ModActions;