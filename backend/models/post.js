const Sequelize = require('sequelize');
const sequelize = require('../sequelize_connection');

module.exports = sequelize.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING(40),
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  imagePath: {
    type: Sequelize.STRING,
    allowNull: true
  },
  userId: Sequelize.INTEGER(11),
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});
