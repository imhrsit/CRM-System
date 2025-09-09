const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    source: {
        type: DataTypes.STRING,
    },
    interestLevel: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.TEXT,
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    },
    assignedTo: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
}, {
    timestamps: true,
});

module.exports = Lead;
