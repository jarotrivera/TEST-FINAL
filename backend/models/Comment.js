const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');
const Post = require('./postModel');

const Comment = sequelize.define('Comment', {
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  postId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Posts',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  tableName: 'Comments'
});

module.exports = Comment;
