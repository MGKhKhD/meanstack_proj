const Sequelize = require('sequelize');
const sequelize = require('../sequelize_connection');

module.exports = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: true
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});
